export async function get(event) {
    const projects = [
        {
            "id": "adam-driver",
            "title": "Adam Driver TED Talk",
            "label": "Adam Driver TED Talk",
            "directory": "adam-driver",
            "poster": "poster.jpg",
            "video": "video.mp4",
            "audio": "audio.flac",
            "transcript": "results.json"
        },
        {
            "id": "boss-baby",
            "title": "Boss Baby",
            "label": "Boss Baby",
            "directory": "boss-baby",
            "poster": "poster.jpg",
            "video": "video.mp4",
            "audio": "audio.flac",
            "transcript": "results.json"
        },
        {
            "id": "car-grand",
            "title": "Car for a Grand",
            "label": "Car for a Grand",
            "directory": "car-grand",
            "poster": "poster.jpg",
            "video": "video.mp4",
            "audio": "audio.flac",
            "transcript": "results.json"
        }
    ];
    return {
        status: 200,
        body: { projects }
    }
}