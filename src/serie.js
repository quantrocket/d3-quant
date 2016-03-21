import {self, extend, isArray, isFunction, forEach} from './utils'
import * as d3 from 'd3-array';


export class Serie {

    constructor(opts) {
        (opts || (opts = {}));
        self.set(this, {
            mode: opts.mode || 'xy',
            name: opts.name || 'default'
        });
    }

    get length() {
        var data = this.data();
        return data ? data.length : 0;
    }

    get fields () {
        var data = this.top(1);
        if (data) {
            var keys = [];
            forEach(data[0], (v, key) => {
                keys.push(key);
            })
            return keys;
        }
    }

    get mode() {
        return self.get(this).mode;
    }

    get name() {
        return self.get(this).name;
    }

    range(field) {
        if (!isFunction(field)) field = indexValue(field);
        return d3.extent(this.data(), field);
    }

    data(_) {
        if (arguments.length === 0) return self.get(this).data;
        self.get(this).data = _;
        return this;
    }

    top (number) {
        var data = this.data();
        if (data) return data.slice(0, number);
    }

    /**
     * Create a new serie from this serie data
     *
     * @param opts
     * @returns {*}
     */
    serie(opts, Constructor) {
        (opts || (opts = {}));
        if (!Constructor) Constructor = Serie;
        var s = new Constructor(extend({}, self.get(this), opts));
        return s.data(this.data());
    }

}


export default function serie (data, opts) {
    if (data instanceof Serie)
        return data.serie(opts);
    if (arguments.length === 1 && !isArray(data))
        return new Serie(data);
    else
        return new Serie(opts).data(data);
}

serie.prototype = Serie.prototype;


export function indexValue (idx) {
    return function (d) {
        return d[idx];
    };
}


export function constantValue (value) {
    return function () {
        return value;
    };
}
