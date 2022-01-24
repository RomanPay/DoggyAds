import * as Pixi from "pixi.js";
import { Images } from "./app";
import { Doggy, DoggyConfig } from "./Doggy";

const DoggysConfig: DoggyConfig[] = [
    { flip: false, scale: 1, landscape: { x: 230, y: 610 }, portrait: { x: 720, y: 570 } },
    { flip: false, scale: 1, landscape: { x: 980, y: 590 }, portrait: { x: 520, y: 440 } },
    { flip: true, scale: 0.8, landscape: { x: 160, y: 260 }, portrait: { x: 510, y: 210 } },
    { flip: false, scale: 0.6, landscape: { x: 540, y: 330 }, portrait: { x: 700, y: 370 } },
    { flip: false, scale: 0.6, landscape: { x: 950, y: 260 }, portrait: { x: 800, y: 240 } },
]

export class MainScene extends Pixi.Container
{
    app: Pixi.Application;
    doggys: Doggy[] = [];

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
        let posX = this.app.screen.width * 0.5 - this.width * 0.5;
        const posY = this.app.screen.height * 0.5 - this.height * 0.5;
        if (widthRatio < heightRatio)
            posX -= 100;
        this.position.set(posX, posY);
    }

    private _init()
    {
        const back = new Pixi.Sprite(this.app.loader.resources[Images.Background].texture);
        this.addChild(back);
        for (let i = 0; i < 5; i++)
        {
            const doggy = new Doggy(this.app, this, DoggysConfig[i]);
            this.doggys.push(doggy);
            doggy.setPosition("landscape");
        }
    }
}
