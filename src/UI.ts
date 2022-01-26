import * as Pixi from "pixi.js";
import { App } from "./app";
import { BGTile64 } from "./assets/BGTile64";
import { Button64 } from "./assets/Button64";
import { Char64 } from "./assets/Char64";
import { Doggy64 } from "./assets/Doggy64";
import { Logo64 } from "./assets/Logo64";
import { MySprite } from "./Utils/MySprite";
import { Sprite64 } from "./Utils/MySprite64";
import { OpenExternalLink } from "./Utils/OpenExternalLink";

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
    char!: Pixi.Sprite;
    logo!: MySprite;
    finalText!: Pixi.Container;
    currentScale!: number;

    constructor(app: Pixi.Application)
    {
        super();
        app.stage.addChild(this);
        
        this.app = app;
        this._init();
        this.setState(StateUI.FirstStep);

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
                this._onThirdStep();
                break;
            default:
                break;

        }
    }

    private _onThirdStep()
    {
        this.baitContainer!.visible = false;
        this.finalText.visible = true;
        this.char.visible = true;
        this.logo.visible = true;
        this.background.alpha = 1;

        let x = 0;
        const scaling = (delta: number) => {
            x += delta * 0.03;
            const scale = (Math.sin(x) + 1) * 0.1;
            this.buttonContainer.scale.set(this.currentScale + scale);
        };

        this.app.ticker.add(scaling);

        this.onResize();
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
        this.char = new Sprite64(Char64);
        this.char.visible = false;
        this.app.stage.addChildAt(this.char, 2);

        this.logo = new Sprite64(Logo64);
        this.logo.visible = false;
        this.app.stage.addChild(this.logo);

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
        gracText.position.set(gracText.width * 0.1, -40);
        questionText.position.set(questionText.width * 0.01, 60);
        this.finalText.addChild(questionText, gracText);
        this.finalText.visible = false;

        this.app.stage.addChild(this.finalText);
        
        // const mask = new Pixi.Graphics();
        // mask.x = char.width * 0.1;
        // mask.y = char.height * 0.1;
        // mask.lineStyle(0);
        // this.addChild(mask);
        // this.char.mask = mask;

    }

    private _initPlayButton()
    {
        this.buttonContainer = new Pixi.Container();
        this.app.stage.addChild(this.buttonContainer);

        const buttonImg = new Sprite64(Button64);
        buttonImg.anchor.set(0.5);
        const buttonText = new Pixi.Text('Play Now', { fontFamily : 'Arial', dropShadow: true, fontWeight: "bold", fontSize: 40, fill : 0xF0F0A3, align : 'center' });
        buttonText.anchor.set(0.5, 0.5);

        this.buttonContainer.addChild(buttonImg, buttonText);
        this.buttonContainer.scale.set(0.8);
        this.buttonContainer.interactive = true;
        this.buttonContainer.on("pointerup", () => OpenExternalLink('https://www.g5e.com/'));
    }

    private _initBackground()
    {
        const background = new Sprite64(BGTile64);
        background.anchor.set(0);
        background.interactive = true;
        background.on("pointerdown",() => { });

        this.app.stage.addChildAt(background, 1);

        this.background = background;
    }

    private _initFirstStep()
    {
        const baitContainer = new Pixi.Container();
        this.baitContainer?.pivot.set(0.5);
        this.app.stage.addChild(baitContainer);

        const text1 = new Pixi.Text('5 Hidden Dogs', { fontFamily : 'Arial', fontSize: 35, fill : 0xFFFFFF, align : 'center' });
        text1.position.set(0, -40);
        const text2 = new Pixi.Text('Can you spot them?', { fontFamily : 'Arial', fontSize: 35, fill : 0xFFFFFF, align : 'center' });
        text2.position.set(0, 40);

        const doggy = new Sprite64(Doggy64);
        doggy.anchor.set(0.5);
        doggy.scale.set(0.6);
        doggy.scale.x *= -1;
        doggy.position.set(text1.getBounds().right + 50, text1.y + 10);
        baitContainer.addChild(text1, text2, doggy);
        this.baitContainer = baitContainer;
        this.baitContainer.visible = false;

        const scaling = (delta: number) => baitContainer.scale.set(baitContainer.scale.x += 0.0001 * delta, baitContainer.scale.y += 0.0001 * delta);

        const disappearance = () => {
            baitContainer.alpha -= 0.05;
            this.background.alpha -= 0.05;
            if (this.background.alpha <= 0)
            {
                this.background.interactive = false;
                this.app.ticker.remove(disappearance);

            }
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
        const scale = this._getScale();
        this.currentScale = scale;

        // const posX = this.app.screen.width * 0.5 - this.width * 0.5;
        // const posY = this.app.screen.height * 0.5 - this.height * 0.2;
        // this.position.set(posX, posY);

        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;

        this.logo.scale.set(scale);
        this.finalText.scale.set(scale);
        this.baitContainer?.scale.set(scale);
        this.baitContainer?.position.set(this.app.screen.width * 0.5 - this.baitContainer.width * 0.5, this.app.screen.height * 0.5);

        this.buttonContainer.scale.set(scale);
        this.buttonContainer.position.set(this.app.screen.width * 0.5, this.app.screen.height - this.buttonContainer.height * 0.5);

        this.logo.position.set(this.app.screen.width * 0.5 - this.logo.width * 0.5, 0);
        this.finalText.position.set(this.app.screen.width * 0.5 - this.finalText.width * 0.5, this.buttonContainer.getBounds().top - this.finalText.height * 0.8)

        this.app.screen.width < this.app.screen.height ? this._vertResize(scale) : this._horResize(scale);
    }

    private _getScale()
    {
        this.logo.scale.set(1);
        this.finalText.scale.set(1);
        this.buttonContainer.scale.set(1);
        const heightObjects = this.logo.height + this.finalText.height + this.buttonContainer.height;
        const widthRatio = this.state === StateUI.ThirdStep ? this.app.screen.width / (this.finalText.width + 50) : this.app.screen.width / this.baitContainer!.width + 200;
        const heightRatio = this.app.screen.height / heightObjects;
        
        let scale = Math.min(widthRatio, heightRatio);
        if (scale > 2) scale = 2;
        
        return scale;
    }

    private _horResize(scale: number)
    {
        this.baitContainer?.scale.set(scale * 2);
        this.baitContainer?.position.set(this.app.screen.width * 0.5 - this.baitContainer.width * 0.5, this.app.screen.height * 0.5);
        this.char.scale.set(scale * 0.8);
        this.char.position.set(0, this.app.screen.height * 0.5 - this.char.height * 0.5);
    }

    private _vertResize(scale: number)
    {
        this.char.scale.set(scale * 0.7);
        this.char.position.set(this.app.screen.width * 0.5 + this.char.width * 0.5, this.app.screen.height * 0.5 - this.char.height * 0.3);
        this.char.scale.x *= -1;
    }
}
