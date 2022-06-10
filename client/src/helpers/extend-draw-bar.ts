// @ts-nocheck

export class extendDrawBar {
    constructor(opt) {
        let ctrl = this;
        ctrl.draw = opt.draw;
        ctrl.buttons = opt.buttons || [];
        ctrl.onAddOrig = opt.draw.onAdd;
        ctrl.onRemoveOrig = opt.draw.onRemove;
    }
    onAdd(map) {
        let ctrl = this;
        ctrl.map = map;
        ctrl.elContainer = ctrl.onAddOrig(map);
        ctrl.buttons.forEach((b) => {
            ctrl.addButton(b);
        });
        return ctrl.elContainer;
    }
    onRemove(map) {
        ctrl.buttons.forEach((b) => {
            ctrl.removeButton(b);
        });
        ctrl.onRemoveOrig(map);
    }
    addButton(opt) {
        let ctrl = this;
        var elButton = document.createElement('button');
        elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
        if (opt.classes instanceof Array) {
            opt.classes.forEach((c) => {
                elButton.classList.add(c);
            });
        }
        if (opt.buttonTitle) {
            elButton.title = opt.buttonTitle;
        }
        elButton.addEventListener(opt.on, opt.action);
        ctrl.elContainer.insertBefore(elButton, ctrl.elContainer.firstChild);
        opt.elButton = elButton;
    }
    removeButton(opt) {
        opt.elButton.removeEventListener(opt.on, opt.action);
        opt.elButton.remove();
    }
}