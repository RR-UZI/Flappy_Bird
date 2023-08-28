import { Scenes } from "../constants";

export class PreloadScene extends Phaser.Scene {
    preload() {
        //
    }

    create() {
        this.load.image("bkg", "src/assets/background-day.png");
        this.load.image("bird", "src/assets/bluebird-downflap.png");
        this.load.image("pipe", "src/assets/pipe-red.png");
        this.load.image("gameover", "src/assets/gameover.png");

        this.load.on("progress", this.#onFileLoadComplete, this);
        this.load.on("complete", this.#onLoadComplete, this);
        this.load.start();
        
    }

    #onFileLoadComplete(progress) {
        console.log("LOAD_PROGRESS", progress);
    }

    #onLoadComplete() {
        this.game.scene.stop(Scenes.Preload);
        this.game.scene.start(Scenes.Boot);
    }
}