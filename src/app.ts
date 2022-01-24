import * as Pixi from "pixi.js"
import { MainScene } from "./MainScene";
import { UI } from "./UI";

var size = [1920, 1080];

export const Images = {
    Char: "assets/images/char.png",
    Background: "assets/images/background.png",
    Doggy: "assets/images/doggy.png",
    Circle: "assets/images/circle.png",
    BackgroundTile: "assets/images/BackgroundTile.png"
}

export const App = new class App extends Pixi.Application
{
    mainScene?: MainScene;
    ui?: UI;
    framesAnim: Pixi.Texture[] = [];

    constructor()
    {
        super({
            // resizeTo: window
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
        this.loader.add([
            Images.Char,
            Images.Background,
            Images.Doggy,
            Images.Circle,
            Images.BackgroundTile
        ]);
        this.loader.add("assets/spritesheets/highlights/texture.json")
        
        this.loader.load(() => {
            this._initAnims();
            this._initScenes();
        });
    }

    private _initAnims()
    {
        const frames = [];
        for (let i = 1; i < 9; i++)
        {
            const val = i;
            frames.push(Pixi.Texture.from(`circle_${val}`));
        }
        this.framesAnim = frames;
    }

    private _initScenes()
    {
        this.mainScene = new MainScene(this);
        this.ui = new UI(this);
        this.onResize();
    }
}

document.body.appendChild(App.view);
window.addEventListener('resize', () => App.onResize());