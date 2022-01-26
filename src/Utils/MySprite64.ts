import * as Pixi from "pixi.js"

export class Sprite64 extends Pixi.Sprite
{
    constructor(img64: string)
    {
        const base = new Pixi.BaseTexture(img64);
        const texture = new Pixi.Texture(base);
        super(texture);
    }
}