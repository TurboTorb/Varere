import fs from 'fs';
import { exec } from 'child-process-promise';
import { v1p1beta1 as speech } from '@google-cloud/speech';
import { v4 as uuidv4 } from 'uuid';

// Creates a client
// const env = import.meta.env;
// let projectId = env.GOOGLE_PROJECT_ID;
// let keyFilename = env.GOOGLE_KEY_FILE;
// const client = new speech.SpeechClient({projectId, keyFilename});
const client = new speech.SpeechClient();


const padding = .1;
const path = "static/data/";

function saveResults(path, results) {
  fs.writeFile(path+'/results.json', results, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

function getSeconds(obj) {
  if (obj == null) return;
  let seconds = obj.seconds;
  if (seconds == null) seconds = "0";
  seconds = Number.parseInt(seconds);
  let nanos = obj.nanos;
  if (nanos == null) nanos = 0;
  let value = seconds+((nanos/1000000)*.001);
  return parseFloat(value.toFixed(2));
}

function getWordsArray(array) {
  // Get the last object in the results array which should be just words with no transcript.
  // The first and only object in that last position will have an alternatives array.
  // It should only have one object that has a words array. We'll return that.
  // return array[array.length-1].alternatives[0].words;

  // Different format from above
  return array[0].results[0].alternatives[0].words;
}

function makesASegment(str) {
  //let arr = str.match(/[^.?!]+[.!?]+[)\s*$]+[\])'"`’”]*|.+/g);
  let arr = str.match(/[^.?!]+[.!?]+[\])'"`’”]*|.+/g);
  if (arr.length > 1) return true;
  return false;
}

function newSegment() {
  return { 
    uid: uuidv4(), 
    words: [] 
  };
}

function getSegmentedResults(words, offset) {
  let results = [];
  let segment = newSegment();
  let sentence = [];
  let i=0;
  for (let obj of words) {
    let str = obj.word.trim();
    let word = {
      word: str,
      startTime: getSeconds(obj.startTime)+offset-padding,
      endTime: getSeconds(obj.endTime)+offset-padding
    };
    console.log(word);
    sentence.push(str);
    let transcript = sentence.join(" ").trim();
    if (makesASegment(transcript)) {
      results.push(segment);
      segment = newSegment();
      sentence = [ str ];
    }
    segment.words.push(word);
    i++;
    if (words.length == i) {
      // adds the very last segment once we reach the last word
      results.push(segment);
    }
  }
  return results;
}

function speechToText(audiodata, start) {
  return new Promise((resolve, reject) => {
    const config = {
      encoding: 'FLAC',
      sampleRateHertz: 44100,
      languageCode: 'en-US',
      audioChannelCount: 2,
      enableSeparateRecognitionPerChannel: false,
      enableAutomaticPunctuation: true,
      diarizationConfig: {
        enableSpeakerDiarization: true,
        minSpeakerCount: 3,
        maxSpeakerCount: 3
      }
    };

    const audio = {
      content: audiodata.toString('base64')
    };

    const request = { config, audio };

    console.log("Sending Request...");
    try {
      // Long running recogniition operation
      //const [operation] = await client.longRunningRecognize(request);
      //const [response] = await operation.promise();

      // Short recognition operation
      // @ts-ignore
      const response = client.recognize(request);
      response.then(data => {
        console.log("Returned Results: ", data);
        let transcript = [];
        if (data.length > 0) {
          try {
            let words = getWordsArray(data);
            transcript = getSegmentedResults(words, start);
          } catch (error) {
            console.error(error);
          }
        }
        console.log("Transcript: ", transcript);
        resolve(transcript);
        return;
      }); 
    } catch (err) {
      reject(err);
      return;
    }
  }); 
}

function getDefaultResults(start, end) {
  return [{ 
    uid: uuidv4(), 
    words: [{
        word: '[...]',
        startTime: start,
        endTime: end
    }] 
  }];
}

function getDirectory(pid) {
  return pid.split('-id')[0]; // Hack for now. Actually query for the project by pid and read the directory.
}

function getClipPath(pid, start, end) {
    let dir = getDirectory(pid);
    //let hash = require("crypto").createHmac("sha256", pid).update(start+"-"+end).digest("hex");
    let hash = start+'-'+end;
    let clips = path+dir+'/clips/'+hash
    if (!fs.existsSync(clips)) fs.mkdirSync(clips, { recursive: true });
    return clips;
}

function getClipResults(pid, start, end) {
  return new Promise((resolve, reject) => {
    let dir = getDirectory(pid);
    let input = path+dir+'/audio.flac'
    let clips = getClipPath(pid, start, end);
    let output = clips+'/clip.flac'
    let results = clips+'/results.json'

    // If we already have results for this clip then just send it back
    let data;
    try {
      data = fs.readFileSync(results, 'utf8');
      resolve(JSON.parse(data));
      return; 
    } catch (err) {
      console.log(err.message);
    };

    // No results Stored. Try to read in any existing clip.
    try {
      data = fs.readFileSync(output);
      speechToText(data, start).then(results => {
        resolve(results);
        return;
      }).catch(function (err) {
        reject(err);
        return;
      });
    } catch (err) {
      // No cip stored. Extract a clip from the full length audio and store it.
      if (padding > 0) {
        start = start + padding;
        end = end + padding;
      }
      let duration = end-start;

      exec('ffmpeg -ss '+start+' -t '+duration+' -i '+input+' '+output)
        .then(function (result) {
            let stdout = result.stdout;
            let stderr = result.stderr;
            console.log('stdout: ', stdout);
            console.log('stderr: ', stderr);

            data = fs.readFileSync(output);
            if (data && data.length > 0) {
              speechToText(data, start).then(results => {
                resolve(results);
                return;
              }).catch(function (err) {
                reject(err);
                return;
              });
            } else {
              resolve(getDefaultResults(start, end));
              return;
            }
        })
        .catch(function (err) {
            reject(err);
            return;
        });
      };
    }
  );
}

function getTestResults(start, end) {
  return new Promise((resolve, reject) => {
    let data = getDefaultResults(start, end);
    setTimeout(function() {
      resolve(data);
      return;
    }, 5000);
  });
}

// fetchTranscript boss-baby 49.5 50.52
export async function get({params, url}) {
  let searchParams = url.searchParams;
  let id = params.id;
  let start = (searchParams && searchParams.get('start')) ? parseFloat(searchParams.get('start')) : 0;
  let end = (searchParams && searchParams.get('end')) ? parseFloat(searchParams.get('end')) : 0;
  console.log(url.origin, '/api/transcript/', id, start, end);

  if (id == 'test') {
    let data = await getTestResults(start, end);
    let transcript = JSON.stringify(data, null, 4);
    console.log("Test", transcript);
    return {
        status: 200,
        body: transcript
    }
  } else {
    let data = await getClipResults(id, start, end);
    if (data && data.length == 0) data = getDefaultResults(start, end);
    let path = getClipPath(id, start, end);
    let transcript = JSON.stringify(data, null, 4);
    saveResults(path, transcript);
    console.log("Output: ", transcript);
    return {
        status: 200,
        body: transcript
    }
  }
}
