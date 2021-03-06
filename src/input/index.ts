/**
 * 构造统一的touchEvent格式
 */

import { status } from '../interface';
import { propX, propY, SUPPORT_ONLY_TOUCH } from '../const';
import { getCenter } from '../vector';
import touchInput from '../input/touch'
import mouseInput from '../input/mouse';

export default class Input {
    // start | move | end | cancel
    public status: status;
    public pointers: any[] = [];
    public changedPointers: any[] = [];
    public timestamp: number;
    public target: EventTarget;
    public currentTarget: EventTarget;
    public center: { x: number, y: number };
    public stopPropagation: () => void;
    public preventDefault: () => void;
    public stopImmediatePropagation: () => void;
    public sourceEvent: any;

    constructor(event: any) {
        let input: Input;
        // Touch
        if (SUPPORT_ONLY_TOUCH) {
            input = touchInput(event);
        }
        // Mouse
        else {
            input = mouseInput(event);
            if (undefined === input) return;
        }

        // 当前触点数
        const pointerLength: number = input.pointers.length;

        // pointers只存储clientX/Y就够了
        for (let i = 0; i < pointerLength; i++) {
            let pointer = input.pointers[i];
            this.pointers[i] = {
                [propX]: Math.round(pointer[propX]),
                [propY]: Math.round(pointer[propY])
            };
        }
        // 中心坐标
        const center = 0 < pointerLength ? getCenter(this.pointers) : undefined;
        // 当前时间
        const timestamp = Date.now();
        // 原生属性/方法
        const { stopPropagation, preventDefault, stopImmediatePropagation, target, currentTarget } = event;
        // mixin
        Object.assign(this, input, { center, timestamp, stopPropagation, preventDefault, stopImmediatePropagation, target, currentTarget, sourceEvent: event });
    }
}