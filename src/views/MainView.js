import { GAME_CONFIG } from "../constants";
import { PipeContainer } from "./PipeContainer";

export class MainView extends Phaser.GameObjects.Container {
    #bkg;
    #bird;
    #pipes;
    #overlap;
    #isLost;


    constructor(scene) {
        super(scene);
        this.#build();
    }

    update() {
        const { height } = this.scene.scale;
        if (this.#bird && this.#bird.y > height - this.#bird.height / 2) {
            this.scene.physics.world.disable(this.#bird);
            this.#disableActions();
        }
        if (this.#isLost) return this.scene.add.image("gameover");
        

        this.#pipes.forEach((p, i) => {
            p.x -= GAME_CONFIG.speed / 2;
            if(p.x <= -26) {
                p.destroy();
                this.#pipes.splice(i, 1);
                this.#addPipe();
            }
        
        });

        this.#bkg.tilePositionX += GAME_CONFIG.speed;
        
    }

    #build() {
        this.#isLost = false;
        this.#pipes = [];
        this.#buildBkg();
        this.#buildBird();
        this.#addPipe();
        this.#addPipe();
        this.#addPipe();
        this.#addOverlap();
        // this.#disableActions();
        // this.#onBkgClick();
    }

    #buildBkg() {
        this.#bkg = this.scene.add.tileSprite(256, 256, 512, 512, "bkg");
        this.#bkg.setInteractive();
        this.#bkg.on("pointerdown", this.#onBkgClick, this);
        this.add(this.#bkg);
    }

    #buildBird() {
        const { width, height } = this.scene.scale;
        this.#bird = this.scene.add.image(width * 0.2, height / 2, "bird");
        this.scene.physics.add.existing(this.#bird);
        this.add(this.#bird);
    }

    #addPipe() {
        const pipeX = this.#pipes.length ? this.#pipes[this.#pipes.length - 1].x + 200 : 300;
        const pipe = new PipeContainer(this.scene);
        pipe.x = pipeX;
        this.add(pipe);
        this.#pipes.push(pipe);
    }

    #addOverlap() {
        const allPipes = this.#pipes.map((p) => p.getPipes()).flat();
        this.#overlap?.destroy();
        this.#overlap = this.scene.physics.add.overlap(this.#bird, allPipes, this.#disableActions, this);
    }

    #disableActions() {
        this.#bkg.disableInteractive();
        // this.#bird.disableInteractive();
        this.#isLost = true;
    }

    #onBkgClick() {
        // this.#bird.x += 10;
        this.#bird.body.velocity.y = GAME_CONFIG.birdVelocity;
    }
}