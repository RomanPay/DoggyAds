import * as Pixi from "pixi.js";
import { MainScene } from "./MainScene";
import { UI } from "./UI";
import { frame_1 } from "./assets/animFrames/Frame_1";
import { frame_2 } from "./assets/animFrames/Frame_2";
import { frame_3 } from "./assets/animFrames/Frame_3";
import { frame_4 } from "./assets/animFrames/Frame_4";
import { frame_5 } from "./assets/animFrames/Frame_5";
import { frame_6 } from "./assets/animFrames/Frame_6";
import { frame_7 } from "./assets/animFrames/Frame_7";
import { frame_8 } from "./assets/animFrames/Frame_8";

export const Images = {
    // Char: "assets/images/char.png",
    // Doggy: "assets/images/doggy.png",
    // Background: "assets/images/background.jpg",
    // BackgroundTile: "assets/images/backgroundTile.png",
    // PlayButton: "assets/images/button.png",
    // Logo: "assets/images/logo.png",
}

async function ReadFile(file: string)
{
    const response = await fetch(file).then(response => response.text());
    return response;
} 

export const App = new class App extends Pixi.Application
{
    mainScene?: MainScene;
    ui?: UI;
    framesAnim: Pixi.Texture[] = [];

    doggy64!: string;
    char64!: string;
    background64!: string;
    backgroundTile64!: string;
    button64!: string;
    logo64!: string;

    constructor()
    {
        super({
            resizeTo: window
        });
        
        this._loadProcessing();
    }

    onResize()
    {
        // console.log("resize", document.documentElement.clientWidth, document.documentElement.clientHeight);
        this.renderer.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
        this.mainScene?.onResize();
        this.ui?.onResize();
    }

    private async _loadProcessing()
    {
        // await this._load64();
        
        this.loader.add("assets/texture.json")
        
        // this.loader.load(() => {
        await this._initAnims();
            this._initScenes();
        // });
    }

    private async _load64()
    {
        const promises = [
            ReadFile("assets/Doggy64.txt").then(r => this.doggy64 = r),
            ReadFile("assets/Char64.txt").then(r => this.char64 = r),
            ReadFile("assets/Background64.txt").then(r => this.background64 = r),
            ReadFile("assets/BGTile64.txt").then(r => this.backgroundTile64 = r),
            ReadFile("assets/Button64.txt").then(r => this.button64 = r),
            ReadFile("assets/Logo64.txt").then(r => this.logo64 = r)
        ];

        return promises;
    }

    private _initAnims()
    {
        const frames = [];
        frames.push(Pixi.Texture.from(frame_1));
        frames.push(Pixi.Texture.from(frame_2));
        frames.push(Pixi.Texture.from(frame_3));
        frames.push(Pixi.Texture.from(frame_4));
        frames.push(Pixi.Texture.from(frame_5));
        frames.push(Pixi.Texture.from(frame_6));
        frames.push(Pixi.Texture.from(frame_7));
        frames.push(Pixi.Texture.from(frame_8));

        this.framesAnim = frames;
    }

    private _initScenes()
    {
        this.mainScene = new MainScene(this);
        this.ui = new UI(this);
        setTimeout(() => this.onResize(), 150);
    }
}

document.body.appendChild(App.view);
document.body.style.margin = "0";
window.addEventListener('resize', () => App.onResize());