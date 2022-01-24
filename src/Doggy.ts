import * as Pixi from "pixi.js";
import { App, Images } from "./app";

export type DoggyConfig = {
    flip: boolean;
    scale: number,
    landscape: { x: number, y: number };
    portrait: { x: number, y: number };
}

export class Doggy
{
    app: Pixi.Application;
    circle: Pixi.Sprite;
    doggy: Pixi.Sprite;
    anim: Pixi.AnimatedSprite;
    config: DoggyConfig;

    constructor(app: Pixi.Application, container: Pixi.Container, config: DoggyConfig)
    {
        this.app = app;
        this.config = config;

        this.circle = new Pixi.Sprite(this.app.loader.resources[Images.Circle].texture);
        this.circle.anchor.set(0.5);
        this.circle.scale.set(config.scale);
        this.circle.visible = false;
        container.addChild(this.circle);

        this.doggy = new Pixi.Sprite(this.app.loader.resources[Images.Doggy].texture);
        this.doggy.interactive = true;
        this.doggy.scale.set(config.scale);
        if (config.flip === true)
            this.doggy.scale.x *= -1;
        this.doggy.anchor.set(0.5);
        this.doggy.on('pointerup', this.onPointerUp, this);
        container.addChild(this.doggy);
        
        const anim = new Pixi.AnimatedSprite(App.framesAnim);
        anim.scale.set(config.scale);
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.visible = false;
        container.addChild(anim);
        this.anim = anim;
    }

    onPointerUp()
    {
        console.log("pointer up");
        this.anim.visible = true;
        this.anim.play();
    }

    setPosition(orientation: "landscape" | "portrait", beforeResize: boolean = false)
    {
        if (beforeResize)
        {
            this.doggy.position.set(0, 0);
            this.circle.position.set(0, 0);
            this.anim.position.set(0, 0);
            return
        }
        switch (orientation)
        {
            case "landscape":
                this.doggy.position.set(this.config.landscape.x, this.config.landscape.y);
                this.circle.position.set(this.config.landscape.x, this.config.landscape.y);
                this.anim.position.set(this.config.landscape.x, this.config.landscape.y);
                break;
            case "portrait":
                this.doggy.position.set(this.config.portrait.x, this.config.portrait.y);
                this.circle.position.set(this.config.portrait.x, this.config.portrait.y);
                this.anim.position.set(this.config.portrait.x, this.config.portrait.y);
                break;
            default:
                break;
        }
    }
}
