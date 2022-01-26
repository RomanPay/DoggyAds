import * as Pixi from "pixi.js";
import { App } from "./app";
import { Doggy64 } from "./assets/Doggy64";
import { Sprite64 } from "./Utils/MySprite64";

export type DoggyConfig = {
    flip: boolean;
    scale: number,
    landscape: { x: number, y: number };
    portrait: { x: number, y: number };
}

export class Doggy
{
    app: Pixi.Application;
    doggy: Pixi.Sprite;
    anim: Pixi.AnimatedSprite;
    config: DoggyConfig;
    callback: Function;
    detected: boolean = false;

    constructor(app: Pixi.Application, container: Pixi.Container, config: DoggyConfig, callback: Function)
    {
        this.app = app;
        this.config = config;
        this.callback = callback;

        // this.doggy = new Pixi.Sprite(this.app.loader.resources[Images.Doggy].texture);
        this.doggy = new Sprite64(Doggy64);
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
        if (this.detected === true)
            return;
        this.detected = true;
        this.callback();
        this.anim.visible = true;
        this.anim.play();
    }

    setScale(scaleFactor?: number)
    {
        if (scaleFactor !== undefined)
        {
            this.doggy.scale.set(this.config.scale * scaleFactor);
            this.anim.scale.set(this.config.scale * scaleFactor);
        }
        else
        {
            this.doggy.scale.set(this.config.scale);
            this.anim.scale.set(this.config.scale);
        }

        if (this.config.flip === true)
                this.doggy.scale.x *= -1;
    }

    setPosition(orientation: "landscape" | "portrait", beforeResize: boolean = false)
    {
        if (beforeResize)
        {
            this.doggy.position.set(0, 0);
            this.anim.position.set(0, 0);
            return
        }
        switch (orientation)
        {
            case "landscape":
                this.doggy.position.set(this.config.landscape.x, this.config.landscape.y);
                this.anim.position.set(this.config.landscape.x, this.config.landscape.y);
                this.setScale();
                break;
            case "portrait":
                this.doggy.position.set(this.config.portrait.x, this.config.portrait.y);
                this.anim.position.set(this.config.portrait.x, this.config.portrait.y);
                this.setScale(0.8);
                break;
            default:
                break;
        }
    }
}
