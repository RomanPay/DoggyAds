import * as Pixi from "pixi.js";
import { Images } from "./app";
import { MySprite } from "./Utils/MySprite";

export const EventsUI = {
    AllDogsDetected: "alldogsdetected"
}

enum StateUI {
    FirstStep,
    SecondStep,
    ThirdStep
}

export class UI extends Pixi.Container
{
    app: Pixi.Application;
    baitContainer?: Pixi.Container;
    background!: MySprite;
    state!: StateUI;
    buttonContainer!: Pixi.Container;
    char!: Pixi.Container;
    logo!: MySprite;
    finalText!: Pixi.Container;

    constructor(app: Pixi.Application)
    {
        super();
        app.stage.addChild(this);
        
        this.app = app;
        this._init();
        this.setState(StateUI.ThirdStep);

        this.app.stage.on(EventsUI.AllDogsDetected, () => this.setState(StateUI.ThirdStep), this);
        this.onResize();
    }

    setState(state: StateUI)
    {
        this.state = state;
        switch(state)
        {
            case StateUI.FirstStep:
                this.baitContainer!.visible = true;
                break;
            case StateUI.SecondStep:
                this.baitContainer!.visible = false;
                break;
            case StateUI.ThirdStep:
                this.baitContainer!.visible = false;
                this.finalText.visible = true;
                this.char.visible = true;
                this.logo.visible = true;
                this.background.visible = true;
                break;
            default:
                break;

        }
    }

    private _init()
    {
        this._initBackground();
        this._initPlayButton();
        this._initFirstStep();
        this._initThirdStep();
    }

    private _initThirdStep()
    {
        this.char = new Pixi.Container();

        const char = new MySprite(this.app, Images.Char);
        char.anchor.set(0.5);
        this.char.addChild(char);

        // const mask = new Pixi.Graphics();
        // mask.x = char.width * 0.1;
        // mask.y = char.height * 0.1;
        // mask.lineStyle(0);
        // this.addChild(mask);
        // this.char.mask = mask;

        this.char.visible = false;

        this.logo = new MySprite(this.app, Images.Logo);
        this.logo.visible = false;

        this.finalText = new Pixi.Container();
        const gracText = new Pixi.Text('Great Job', {
            fontFamily : 'Arial',
            dropShadow: true,
            fontWeight: "bold",
            fontSize: 80,
            fill: 0xF0F0A3,
            align: 'center'
        });
        const questionText = new Pixi.Text('Can you solve\nevery mystery?', {
            fontFamily: 'Arial',
            dropShadow: true,
            fontWeight: "bold",
            fontSize: 60,
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.logo.position.set(0, -200);
        gracText.position.set(gracText.width * 0.2, -40);
        questionText.position.set(questionText.width * 0.15, 60);
        this.finalText.addChild(questionText, gracText);
        this.finalText.position.set(0, 100);
        this.finalText.visible = false;

        this.app.stage.addChildAt(this.char, 2);

        this.addChild(this.finalText, this.logo, this.finalText);
    }

    private _initPlayButton()
    {
        this.buttonContainer = new Pixi.Container();
        this.app.stage.addChild(this.buttonContainer);

        const buttonImg = new MySprite(this.app, Images.PlayButton);
        buttonImg.anchor.set(0.5);
        const buttonText = new Pixi.Text('Play Now', { fontFamily : 'Arial', dropShadow: true, fontWeight: "bold", fontSize: 40, fill : 0xF0F0A3, align : 'center' });
        buttonText.anchor.set(0.5, 0.5);

        this.buttonContainer.addChild(buttonImg, buttonText);
        this.buttonContainer.scale.set(0.8)
    }

    private _initBackground()
    {
        const background = new MySprite(this.app, Images.BackgroundTile);
        background.anchor.set(0);

        this.app.stage.addChildAt(background, 1);

        this.background = background;
    }

    private _initFirstStep()
    {
        const baitContainer = new Pixi.Container();
        this.addChild(baitContainer);

        const text1 = new Pixi.Text('5 Hidden Dogs', { fontFamily : 'Arial', fontSize: 60, fill : 0xFFFFFF, align : 'center' });
        text1.position.set(0, -40);
        const text2 = new Pixi.Text('Can you spot them?', { fontFamily : 'Arial', fontSize: 60, fill : 0xFFFFFF, align : 'center' });
        text2.position.set(0, 40);

        const doggy = new MySprite(this.app, Images.Doggy);
        doggy.anchor.set(0.5);
        doggy.scale.set(0.8);
        doggy.scale.x *= -1;
        doggy.position.set(text1.getBounds().right + doggy.getBounds().width * 0.5, text1.y + doggy.getBounds().height * 0.2);
        baitContainer.addChild(text1, text2, doggy);
        this.baitContainer = baitContainer;
        this.baitContainer.visible = false;

        const scaling = (delta: number) => baitContainer.scale.set(baitContainer.scale.x += 0.0001 * delta, baitContainer.scale.y += 0.0001 * delta);

        const disappearance = () => {
            baitContainer.alpha -= 0.05;
            // this.background.alpha -= 0.05;
        }

        this.app.ticker.add(scaling);  
        setTimeout (() => {
            this.app.ticker.remove(scaling);
            this.app.ticker.add(disappearance);
            this.setState(StateUI.SecondStep);
        }, 4000);
    }

    onResize()
    {
        const width = this.app.screen.width;
        const height = this.app.screen.height;

        this.scale.set(1);
        const widthRatio = width / this.width;
        const heightRatio = height / this.height;
        
        let scale = Math.min(widthRatio, heightRatio);
        if (scale > 2) scale = 2;
        this.scale.set(scale * 0.9);

        const posX = this.app.screen.width * 0.5 - this.width * 0.5;
        const posY = this.app.screen.height * 0.5 - this.height * 0.2;
        this.position.set(posX, posY);

        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;

        this.buttonContainer.position.set(this.app.screen.width * 0.5, this.app.screen.height - this.buttonContainer.height * 0.5);
        this.buttonContainer.scale.set(scale);

        this.char.scale.set(scale * 0.8);
        if (width < height)
        {
            this.char.position.set(this.app.screen.width * 0.5, this.app.screen.height - this.char.height * 0.4);
            this.char.scale.x *= -1;
        }
        else
            this.char.position.set(this.app.screen.width * 0.5 - this.char.width, this.app.screen.height - this.char.height * 0.4);
        // this.logo.position.set(this.app.screen.width * 0.5, this.logo.height * 0.5);
    }
}
