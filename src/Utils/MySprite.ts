import * as Pixi from "pixi.js";

export class MySprite extends Pixi.Sprite
{
    constructor(app: Pixi.Application, texture: string)
    {
        super(app.loader.resources[texture].texture);
    }
}