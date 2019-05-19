
function idToAudio(id) {
    let random = Math.floor(Math.random() * 650) + 1
    let url = "https://fent.github.io/pokecry/media/cries/old/" + random + ".mp3";
    let audio = new Audio(url);
    return audio;
}

export default idToAudio;