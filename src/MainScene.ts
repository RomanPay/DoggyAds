import * as Pixi from "pixi.js";
import { App } from "./app";
import { Background64 } from "./assets/Background64";
import { Doggy, DoggyConfig } from "./Doggy";
import { EventsUI } from "./UI";
import { MySprite } from "./Utils/MySprite";
import { Sprite64 } from "./Utils/MySprite64";

const DoggysConfig: DoggyConfig[] = [
    { flip: false, scale: 1, landscape: { x: 230 - 535, y: 610 - 385 }, portrait: { x: 720 - 535, y: 570 - 385 + 10 } },
    { flip: false, scale: 1, landscape: { x: 980 - 535, y: 590 - 385 }, portrait: { x: 520 - 535, y: 440 - 385 + 10 } },
    // { flip: true, scale: 0.8, landscape: { x: 160, y: 260 }, portrait: { x: 510 - 535, y: 210 - 385 } },
    { flip: true, scale: 0.8, landscape: { x: -375, y: -125 }, portrait: { x: 510 - 535, y: 210 - 385 + 10 } },
    { flip: false, scale: 0.6, landscape: { x: 540 - 535, y: 330 - 385 }, portrait: { x: 700 - 535, y: 370 - 385 + 10 } },
    { flip: false, scale: 0.6, landscape: { x: 950 - 535, y: 260 - 385 }, portrait: { x: 800 - 535, y: 240 - 385 + 10 } },
]

export class MainScene extends Pixi.Container
{
    app: Pixi.Application;
    doggys: Doggy[] = [];
    numDetectedDogs: number = 0;

    constructor(app: Pixi.Application)
    {
        super();
        app.stage.addChild(this);
        this.app = app;

        this._init();
    }

    onResize()
    {
        const width = this.app.screen.width;
        const height = this.app.screen.height;

        this.scale.set(1);
        const widthRatio = width / this.width;
        const heightRatio = height / this.height;
        
        const scale = Math.max(widthRatio, heightRatio);
        this.scale.set(scale);
        widthRatio > heightRatio ?  this.doggys.forEach(doggy => doggy.setPosition("landscape")) : 
                                    this.doggys.forEach(doggy => doggy.setPosition("portrait"));
        let posX = this.app.screen.width * 0.5;
        const posY = this.app.screen.height * 0.5;
        if (widthRatio < heightRatio)
            posX -= 100;
        this.position.set(posX, posY);
    }

    private _init()
    {
        const back = new Sprite64(Background64);
        back.anchor.set(0.5);
        this.addChild(back);
        for (let i = 0; i < 5; i++)
        {
            const doggy = new Doggy(this.app, this, DoggysConfig[i], () => this.dogsCount());
            this.doggys.push(doggy);
            doggy.setPosition("landscape");
        }
    }

    private dogsCount()
    {
        this.numDetectedDogs++;
        if (this.numDetectedDogs >= 5)
        {
            setTimeout(() => this.app.stage.emit(EventsUI.AllDogsDetected), 300);
        }
    }
}