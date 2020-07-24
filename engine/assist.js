let playIcon = $(".playicon");
let play = $(".play");
let pause = $(".pause");

audio.stop = () => {
    audio.pause();
    audio.currentTime = 0;
};

audio.canPlay = false;
audio.playState = "paused";
$("audio").on("canplaythrough", () => (audio.canPlay = true));

playIcon.click(() => {
    if (audio.playState == "paused" || audio.playState == "") {
        pause.removeClass("hidden");
        play.addClass("hidden");
        audio.playState = "running";
        audio.play();
    } else if (audio.playState == "running") {
        play.removeClass("hidden");
        pause.addClass("hidden");
        audio.playState = "paused"; // Logging the animation-play-state to the console:

        audio.stop();
    }

    log(audio.playState);
});