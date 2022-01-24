import * as Pixi from "pixi.js";
import { Images } from "./app";
import { MySprite } from "./Utils/MySprite";

export class UI extends Pixi.Container
{
    app: Pixi.Application;
    textContainer?: Pixi.Container;
    background!: MySprite;

    constructor(app: Pixi.Application)
    {
        super();
        app.stage.addChild(this);

        this.app = app;
        this._init();
    }

    private _init()
    {
        this._initBackground();
        this._initTextContainer();
        const char = new MySprite(this.app, Images.Char);
        this.addChild(char);
        char.visible = false;
    }

    private _initBackground()
    {
        const background = new MySprite(this.app, Images.BackgroundTile);

        background.scale.set(40)
        this.app.stage.addChildAt(background, 1);

        this.background = background;
    }

    private _initTextContainer()
    {
        const textContainer = new Pixi.Container();
        this.app.stage.addChild(textContainer);

        const text1 = new Pixi.Text('5 Hidden Dogs', { fontFamily : 'Arial', fontSize: 60, fill : 0xFFFFFF, align : 'center' });
        text1.position.set(0, -40);
        const text2 = new Pixi.Text('Can you spot them?', { fontFamily : 'Arial', fontSize: 60, fill : 0xFFFFFF, align : 'center' });
        text2.position.set(-40, 40);

        const doggy = new MySprite(this.app, Images.Doggy);
        doggy.scale.set(0.8);
        doggy.scale.x *= -1;
        doggy.position.set(text1.getBounds().right + doggy.getBounds().width * 0.5, text1.y + doggy.getBounds().height * 0.2);
        textContainer.addChild(text1, text2, doggy);
        this.textContainer = textContainer;

        const scaling = (delta: number) => textContainer.scale.set(textContainer.scale.x += 0.0001);

        const disappearance = () => {
            textContainer.alpha -= 0.05;
            this.background.alpha -= 0.05;
        }

        this.app.ticker.add(scaling);  
        setTimeout (() => {
            this.app.ticker.remove(scaling);
            this.app.ticker.add(disappearance);
        }, 4000);
    }

    onResize()
    {
        const width = this.app.screen.width;
        const height = this.app.screen.height;

        this.scale.set(1);
        const widthRatio = width / this.width;
        const heightRatio = height / this.height;
        
        const scale = Math.min(widthRatio, heightRatio);
        this.scale.set(scale);

        this.position.set(this.app.screen.width * 0.5 - this.width * 0.5, this.app.screen.height * 0.5 - this.height * 0.5);
        this.textContainer?.position.set(this.app.screen.width * 0.5 - this.textContainer.width * 0.5,
                                            this.app.screen.height * 0.5 - this.textContainer.height * 0.5);
    }
}
