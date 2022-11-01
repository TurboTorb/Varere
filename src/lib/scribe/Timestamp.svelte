<script>
    import { onMount } from "svelte";
    
    export let index = 0;
    export let scale;

    let timestamp = "00:00:00";

    function getTimeStamp(given_seconds) {
      let hours = Math.floor(given_seconds / 3600);
      let minutes = Math.floor((given_seconds - (hours * 3600)) / 60);
      let seconds = given_seconds - (hours * 3600) - (minutes * 60);

      return hours.toString().padStart(2, '0') + ':' + 
            minutes.toString().padStart(2, '0') + ':' + 
            seconds.toString().padStart(2, '0');
    }

    onMount(async () => {
      timestamp = getTimeStamp((index*4)+2);
    });
</script>

<style>
    #time {
      height: 25px;
      background-image: url("/assets/img/ticks.png");
      background-repeat: repeat-x;
      display: flex;
    }

    #stamp {
        position: relative;
        top: -1px; 
        margin: 0px;
        width: 100%;
        text-align: center;
        font-size: 0.50rem;
    }
  </style>

<div id="time" style="width: {scale * 4}">
    <span id="stamp">{timestamp}</span>
</div>