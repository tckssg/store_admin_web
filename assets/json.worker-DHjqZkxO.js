(function() {
	const e = new class {
		constructor() {
			this.listeners = [], this.unexpectedErrorHandler = function(e) {
				setTimeout(() => {
					if (e.stack) {
						if (s.isErrorNoTelemetry(e)) throw new s(e.message + "\n\n" + e.stack);
						throw new Error(e.message + "\n\n" + e.stack);
					}
					throw e;
				}, 0);
			};
		}
		emit(e) {
			this.listeners.forEach((t) => {
				t(e);
			});
		}
		onUnexpectedError(e) {
			this.unexpectedErrorHandler(e), this.emit(e);
		}
		onUnexpectedExternalError(e) {
			this.unexpectedErrorHandler(e);
		}
	}();
	function t(t) {
		var n;
		(n = t) instanceof i || n instanceof Error && "Canceled" === n.name && "Canceled" === n.message || e.onUnexpectedError(t);
	}
	function n(e) {
		if (e instanceof Error) {
			const { name: t, message: r, cause: i } = e;
			return {
				$isError: !0,
				name: t,
				message: r,
				stack: e.stacktrace || e.stack,
				noTelemetry: s.isErrorNoTelemetry(e),
				cause: i ? n(i) : void 0,
				code: e.code
			};
		}
		return e;
	}
	var r, i = class extends Error {
		constructor() {
			super("Canceled"), this.name = this.message;
		}
	}, s = class e extends Error {
		constructor(e) {
			super(e), this.name = "CodeExpectedError";
		}
		static fromError(t) {
			if (t instanceof e) return t;
			const n = new e();
			return n.message = t.message, n.stack = t.stack, n;
		}
		static isErrorNoTelemetry(e) {
			return "CodeExpectedError" === e.name;
		}
	}, o = class e extends Error {
		constructor(t) {
			super(t || "An unexpected bug occurred."), Object.setPrototypeOf(this, e.prototype);
		}
	};
	function a(e, t = "Unreachable") {
		throw new Error(t);
	}
	function l(e) {
		e() || (e(), t(new o("Assertion Failed")));
	}
	function u(e, t) {
		let n = 0;
		for (; n < e.length - 1;) {
			if (!t(e[n], e[n + 1])) return !1;
			n++;
		}
		return !0;
	}
	function c(e) {
		return !!e && "function" == typeof e[Symbol.iterator];
	}
	function h(e) {
		if (r.is(e)) {
			const n = [];
			for (const r of e) if (r) try {
				r.dispose();
			} catch (t) {
				n.push(t);
			}
			if (1 === n.length) throw n[0];
			if (n.length > 1) throw new AggregateError(n, "Encountered errors while disposing of store");
			return Array.isArray(e) ? [] : e;
		}
		if (e) return e.dispose(), e;
	}
	(function(e) {
		function t(e) {
			return !!e && "object" == typeof e && "function" == typeof e[Symbol.iterator];
		}
		e.is = t;
		const n = Object.freeze([]);
		function* r(e) {
			yield e;
		}
		e.empty = function() {
			return n;
		}, e.single = r, e.wrap = function(e) {
			return t(e) ? e : r(e);
		}, e.from = function(e) {
			return e || n;
		}, e.reverse = function* (e) {
			for (let t = e.length - 1; t >= 0; t--) yield e[t];
		}, e.isEmpty = function(e) {
			return !e || !0 === e[Symbol.iterator]().next().done;
		}, e.first = function(e) {
			return e[Symbol.iterator]().next().value;
		}, e.some = function(e, t) {
			let n = 0;
			for (const r of e) if (t(r, n++)) return !0;
			return !1;
		}, e.every = function(e, t) {
			let n = 0;
			for (const r of e) if (!t(r, n++)) return !1;
			return !0;
		}, e.find = function(e, t) {
			for (const n of e) if (t(n)) return n;
		}, e.filter = function* (e, t) {
			for (const n of e) t(n) && (yield n);
		}, e.map = function* (e, t) {
			let n = 0;
			for (const r of e) yield t(r, n++);
		}, e.flatMap = function* (e, t) {
			let n = 0;
			for (const r of e) yield* t(r, n++);
		}, e.concat = function* (...e) {
			for (const t of e) c(t) ? yield* t : yield t;
		}, e.reduce = function(e, t, n) {
			let r = n;
			for (const i of e) r = t(r, i);
			return r;
		}, e.length = function(e) {
			let t = 0;
			for (const n of e) t++;
			return t;
		}, e.slice = function* (e, t, n = e.length) {
			for (t < -e.length && (t = 0), t < 0 && (t += e.length), n < 0 ? n += e.length : n > e.length && (n = e.length); t < n; t++) yield e[t];
		}, e.consume = function(t, n = Number.POSITIVE_INFINITY) {
			const r = [];
			if (0 === n) return [r, t];
			const i = t[Symbol.iterator]();
			for (let s = 0; s < n; s++) {
				const t = i.next();
				if (t.done) return [r, e.empty()];
				r.push(t.value);
			}
			return [r, { [Symbol.iterator]: () => i }];
		}, e.asyncToArray = async function(e) {
			const t = [];
			for await (const n of e) t.push(n);
			return t;
		}, e.asyncToArrayFlat = async function(e) {
			let t = [];
			for await (const n of e) t = t.concat(n);
			return t;
		};
	})(r || (r = {}));
	var d = class {
		constructor(e) {
			this._isDisposed = !1, this._fn = e;
		}
		dispose() {
			if (!this._isDisposed) {
				if (!this._fn) throw new Error("Unbound disposable context: Need to use an arrow function to preserve the value of this");
				this._isDisposed = !0, this._fn();
			}
		}
	};
	function f(e) {
		return new d(e);
	}
	var m = class e {
		static {
			this.DISABLE_DISPOSED_WARNING = !1;
		}
		constructor() {
			this._toDispose = /* @__PURE__ */ new Set(), this._isDisposed = !1;
		}
		dispose() {
			this._isDisposed || (this._isDisposed = !0, this.clear());
		}
		get isDisposed() {
			return this._isDisposed;
		}
		clear() {
			if (0 !== this._toDispose.size) try {
				h(this._toDispose);
			} finally {
				this._toDispose.clear();
			}
		}
		add(t) {
			if (!t || t === g.None) return t;
			if (t === this) throw new Error("Cannot register a disposable on itself!");
			return this._isDisposed ? e.DISABLE_DISPOSED_WARNING : this._toDispose.add(t), t;
		}
		delete(e) {
			if (e) {
				if (e === this) throw new Error("Cannot dispose a disposable on itself!");
				this._toDispose.delete(e), e.dispose();
			}
		}
	}, g = class {
		static {
			this.None = Object.freeze({ dispose() {} });
		}
		constructor() {
			this._store = new m(), this._store;
		}
		dispose() {
			this._store.dispose();
		}
		_register(e) {
			if (e === this) throw new Error("Cannot register a disposable on itself!");
			return this._store.add(e);
		}
	}, p = class e {
		static {
			this.Undefined = new e(void 0);
		}
		constructor(t) {
			this.element = t, this.next = e.Undefined, this.prev = e.Undefined;
		}
	}, b = class {
		constructor() {
			this._first = p.Undefined, this._last = p.Undefined, this._size = 0;
		}
		get size() {
			return this._size;
		}
		isEmpty() {
			return this._first === p.Undefined;
		}
		clear() {
			let e = this._first;
			for (; e !== p.Undefined;) {
				const t = e.next;
				e.prev = p.Undefined, e.next = p.Undefined, e = t;
			}
			this._first = p.Undefined, this._last = p.Undefined, this._size = 0;
		}
		unshift(e) {
			return this._insert(e, !1);
		}
		push(e) {
			return this._insert(e, !0);
		}
		_insert(e, t) {
			const n = new p(e);
			if (this._first === p.Undefined) this._first = n, this._last = n;
			else if (t) {
				const e = this._last;
				this._last = n, n.prev = e, e.next = n;
			} else {
				const e = this._first;
				this._first = n, n.next = e, e.prev = n;
			}
			this._size += 1;
			let r = !1;
			return () => {
				r || (r = !0, this._remove(n));
			};
		}
		shift() {
			if (this._first !== p.Undefined) {
				const e = this._first.element;
				return this._remove(this._first), e;
			}
		}
		pop() {
			if (this._last !== p.Undefined) {
				const e = this._last.element;
				return this._remove(this._last), e;
			}
		}
		_remove(e) {
			if (e.prev !== p.Undefined && e.next !== p.Undefined) {
				const t = e.prev;
				t.next = e.next, e.next.prev = t;
			} else e.prev === p.Undefined && e.next === p.Undefined ? (this._first = p.Undefined, this._last = p.Undefined) : e.next === p.Undefined ? (this._last = this._last.prev, this._last.next = p.Undefined) : e.prev === p.Undefined && (this._first = this._first.next, this._first.prev = p.Undefined);
			this._size -= 1;
		}
		*[Symbol.iterator]() {
			let e = this._first;
			for (; e !== p.Undefined;) yield e.element, e = e.next;
		}
	};
	const y = globalThis.performance.now.bind(globalThis.performance);
	var v, w = class e {
		static create(t) {
			return new e(t);
		}
		constructor(e) {
			this._now = !1 === e ? Date.now : y, this._startTime = this._now(), this._stopTime = -1;
		}
		stop() {
			this._stopTime = this._now();
		}
		reset() {
			this._startTime = this._now(), this._stopTime = -1;
		}
		elapsed() {
			return -1 !== this._stopTime ? this._stopTime - this._startTime : this._now() - this._startTime;
		}
	};
	(function(e) {
		function t(e) {
			return (t, n = null, r) => {
				let i, s = !1;
				return i = e((e) => {
					if (!s) return i ? i.dispose() : s = !0, t.call(n, e);
				}, null, r), s && i.dispose(), i;
			};
		}
		function n(e, t, n) {
			return i((n, r = null, i) => e((e) => n.call(r, t(e)), null, i), n);
		}
		function r(e, t, n) {
			return i((n, r = null, i) => e((e) => t(e) && n.call(r, e), null, i), n);
		}
		function i(e, t) {
			let n;
			const r = new E({
				onWillAddFirstListener() {
					n = e(r.fire, r);
				},
				onDidRemoveLastListener() {
					n?.dispose();
				}
			});
			return t?.add(r), r.event;
		}
		function s(e, t, n = 100, r = !1, i = !1, s, o) {
			let a, l, u, c, h = 0;
			const d = new E({
				leakWarningThreshold: s,
				onWillAddFirstListener() {
					a = e((e) => {
						h++, l = t(l, e), r && !u && (d.fire(l), l = void 0), c = () => {
							const e = l;
							l = void 0, u = void 0, (!r || h > 1) && d.fire(e), h = 0;
						}, "number" == typeof n ? (u && clearTimeout(u), u = setTimeout(c, n)) : void 0 === u && (u = null, queueMicrotask(c));
					});
				},
				onWillRemoveListener() {
					i && h > 0 && c?.();
				},
				onDidRemoveLastListener() {
					c = void 0, a.dispose();
				}
			});
			return o?.add(d), d.event;
		}
		e.None = () => g.None, e.defer = function(e, t) {
			return s(e, () => {}, 0, void 0, !0, void 0, t);
		}, e.once = t, e.onceIf = function(t, n) {
			return e.once(e.filter(t, n));
		}, e.map = n, e.forEach = function(e, t, n) {
			return i((n, r = null, i) => e((e) => {
				t(e), n.call(r, e);
			}, null, i), n);
		}, e.filter = r, e.signal = function(e) {
			return e;
		}, e.any = function(...e) {
			return (t, n = null, r) => function(e, t) {
				t instanceof Array ? t.push(e) : t && t.add(e);
				return e;
			}(function(...e) {
				return f(() => h(e));
			}(...e.map((e) => e((e) => t.call(n, e)))), r);
		}, e.reduce = function(e, t, r, i) {
			let s = r;
			return n(e, (e) => (s = t(s, e), s), i);
		}, e.debounce = s, e.accumulate = function(t, n = 0, r) {
			return e.debounce(t, (e, t) => e ? (e.push(t), e) : [t], n, void 0, !0, void 0, r);
		}, e.latch = function(e, t = (e, t) => e === t, n) {
			let i, s = !0;
			return r(e, (e) => {
				const n = s || !t(e, i);
				return s = !1, i = e, n;
			}, n);
		}, e.split = function(t, n, r) {
			return [e.filter(t, n, r), e.filter(t, (e) => !n(e), r)];
		}, e.buffer = function(e, t = !1, n = [], r) {
			let i = n.slice(), s = e((e) => {
				i ? i.push(e) : a.fire(e);
			});
			r && r.add(s);
			const o = () => {
				i?.forEach((e) => a.fire(e)), i = null;
			}, a = new E({
				onWillAddFirstListener() {
					s || (s = e((e) => a.fire(e)), r && r.add(s));
				},
				onDidAddFirstListener() {
					i && (t ? setTimeout(o) : o());
				},
				onDidRemoveLastListener() {
					s && s.dispose(), s = null;
				}
			});
			return r && r.add(a), a.event;
		}, e.chain = function(e, t) {
			return (n, r, i) => {
				const s = t(new a());
				return e(function(e) {
					const t = s.evaluate(e);
					t !== o && n.call(r, t);
				}, void 0, i);
			};
		};
		const o = Symbol("HaltChainable");
		class a {
			constructor() {
				this.steps = [];
			}
			map(e) {
				return this.steps.push(e), this;
			}
			forEach(e) {
				return this.steps.push((t) => (e(t), t)), this;
			}
			filter(e) {
				return this.steps.push((t) => e(t) ? t : o), this;
			}
			reduce(e, t) {
				let n = t;
				return this.steps.push((t) => (n = e(n, t), n)), this;
			}
			latch(e = (e, t) => e === t) {
				let t, n = !0;
				return this.steps.push((r) => {
					const i = n || !e(r, t);
					return n = !1, t = r, i ? r : o;
				}), this;
			}
			evaluate(e) {
				for (const t of this.steps) if ((e = t(e)) === o) break;
				return e;
			}
		}
		e.fromNodeEventEmitter = function(e, t, n = (e) => e) {
			const r = (...e) => i.fire(n(...e)), i = new E({
				onWillAddFirstListener: () => e.on(t, r),
				onDidRemoveLastListener: () => e.removeListener(t, r)
			});
			return i.event;
		}, e.fromDOMEventEmitter = function(e, t, n = (e) => e) {
			const r = (...e) => i.fire(n(...e)), i = new E({
				onWillAddFirstListener: () => e.addEventListener(t, r),
				onDidRemoveLastListener: () => e.removeEventListener(t, r)
			});
			return i.event;
		}, e.toPromise = function(e, n) {
			let r;
			const i = new Promise((i, s) => {
				const o = t(e)(i, null, n);
				r = () => o.dispose();
			});
			return i.cancel = r, i;
		}, e.forward = function(e, t) {
			return e((e) => t.fire(e));
		}, e.runAndSubscribe = function(e, t, n) {
			return t(n), e((e) => t(e));
		};
		class l {
			constructor(e, t) {
				this._observable = e, this._counter = 0, this._hasChanged = !1, this.emitter = new E({
					onWillAddFirstListener: () => {
						e.addObserver(this), this._observable.reportChanges();
					},
					onDidRemoveLastListener: () => {
						e.removeObserver(this);
					}
				}), t && t.add(this.emitter);
			}
			beginUpdate(e) {
				this._counter++;
			}
			handlePossibleChange(e) {}
			handleChange(e, t) {
				this._hasChanged = !0;
			}
			endUpdate(e) {
				this._counter--, 0 === this._counter && (this._observable.reportChanges(), this._hasChanged && (this._hasChanged = !1, this.emitter.fire(this._observable.get())));
			}
		}
		e.fromObservable = function(e, t) {
			return new l(e, t).emitter.event;
		}, e.fromObservableLight = function(e) {
			return (t, n, r) => {
				let i = 0, s = !1;
				const o = {
					beginUpdate() {
						i++;
					},
					endUpdate() {
						i--, 0 === i && (e.reportChanges(), s && (s = !1, t.call(n)));
					},
					handlePossibleChange() {},
					handleChange() {
						s = !0;
					}
				};
				e.addObserver(o), e.reportChanges();
				const a = { dispose() {
					e.removeObserver(o);
				} };
				return r instanceof m ? r.add(a) : Array.isArray(r) && r.push(a), a;
			};
		};
	})(v || (v = {}));
	var _ = class e {
		static {
			this.all = /* @__PURE__ */ new Set();
		}
		static {
			this._idPool = 0;
		}
		constructor(t) {
			this.listenerCount = 0, this.invocationCount = 0, this.elapsedOverall = 0, this.durations = [], this.name = `${t}_${e._idPool++}`, e.all.add(this);
		}
		start(e) {
			this._stopWatch = new w(), this.listenerCount = e;
		}
		stop() {
			if (this._stopWatch) {
				const e = this._stopWatch.elapsed();
				this.durations.push(e), this.elapsedOverall += e, this.invocationCount += 1, this._stopWatch = void 0;
			}
		}
	};
	var C = class e {
		static {
			this._idPool = 1;
		}
		constructor(t, n, r = (e._idPool++).toString(16).padStart(3, "0")) {
			this._errorHandler = t, this.threshold = n, this.name = r, this._warnCountdown = 0;
		}
		dispose() {
			this._stacks?.clear();
		}
		check(e, t) {
			const n = this.threshold;
			if (n <= 0 || t < n) return;
			this._stacks || (this._stacks = /* @__PURE__ */ new Map());
			const r = this._stacks.get(e.value) || 0;
			if (this._stacks.set(e.value, r + 1), this._warnCountdown -= 1, this._warnCountdown <= 0) {
				this._warnCountdown = .5 * n;
				const [e, r] = this.getMostFrequentStack(), s = new L(`[${this.name}] potential listener LEAK detected, having ${t} listeners already. MOST frequent listener (${r}):`, e);
				this._errorHandler(s);
			}
			return () => {
				const t = this._stacks.get(e.value) || 0;
				this._stacks.set(e.value, t - 1);
			};
		}
		getMostFrequentStack() {
			if (!this._stacks) return;
			let e, t = 0;
			for (const [n, r] of this._stacks) (!e || t < r) && (e = [n, r], t = r);
			return e;
		}
	}, S = class e {
		static create() {
			return new e((/* @__PURE__ */ new Error()).stack ?? "");
		}
		constructor(e) {
			this.value = e;
		}
		print() {}
	}, L = class extends Error {
		constructor(e, t) {
			super(e), this.name = "ListenerLeakError", this.stack = t;
		}
	}, N = class extends Error {
		constructor(e, t) {
			super(e), this.name = "ListenerRefusalError", this.stack = t;
		}
	}, x = class {
		constructor(e) {
			this.value = e;
		}
	};
	var E = class {
		constructor(e) {
			this._size = 0, this._options = e, this._leakageMon = this._options?.leakWarningThreshold ? new C(e?.onListenerError ?? t, this._options?.leakWarningThreshold ?? -1) : void 0, this._perfMon = this._options?._profName ? new _(this._options._profName) : void 0, this._deliveryQueue = this._options?.deliveryQueue;
		}
		dispose() {
			this._disposed || (this._disposed = !0, this._deliveryQueue?.current === this && this._deliveryQueue.reset(), this._listeners && (this._listeners = void 0, this._size = 0), this._options?.onDidRemoveLastListener?.(), this._leakageMon?.dispose());
		}
		get event() {
			return this._event ??= (e, n, r) => {
				if (this._leakageMon && this._size > this._leakageMon.threshold ** 2) {
					const e = `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`, n = this._leakageMon.getMostFrequentStack() ?? ["UNKNOWN stack", -1], r = new N(`${e}. HINT: Stack shows most frequent listener (${n[1]}-times)`, n[0]);
					return (this._options?.onListenerError || t)(r), g.None;
				}
				if (this._disposed) return g.None;
				n && (e = e.bind(n));
				const i = new x(e);
				let s;
				this._leakageMon && this._size >= Math.ceil(.2 * this._leakageMon.threshold) && (i.stack = S.create(), s = this._leakageMon.check(i.stack, this._size + 1)), this._listeners ? this._listeners instanceof x ? (this._deliveryQueue ??= new A(), this._listeners = [this._listeners, i]) : this._listeners.push(i) : (this._options?.onWillAddFirstListener?.(this), this._listeners = i, this._options?.onDidAddFirstListener?.(this)), this._options?.onDidAddListener?.(this), this._size++;
				const o = f(() => {
					s?.(), this._removeListener(i);
				});
				return r instanceof m ? r.add(o) : Array.isArray(r) && r.push(o), o;
			}, this._event;
		}
		_removeListener(e) {
			if (this._options?.onWillRemoveListener?.(this), !this._listeners) return;
			if (1 === this._size) return this._listeners = void 0, this._options?.onDidRemoveLastListener?.(this), void (this._size = 0);
			const t = this._listeners, n = t.indexOf(e);
			if (-1 === n) throw new Error("Attempted to dispose unknown listener");
			this._size--, t[n] = void 0;
			const r = this._deliveryQueue.current === this;
			if (2 * this._size <= t.length) {
				let e = 0;
				for (let n = 0; n < t.length; n++) t[n] ? t[e++] = t[n] : r && e < this._deliveryQueue.end && (this._deliveryQueue.end--, e < this._deliveryQueue.i && this._deliveryQueue.i--);
				t.length = e;
			}
		}
		_deliver(e, n) {
			if (!e) return;
			const r = this._options?.onListenerError || t;
			if (r) try {
				e.value(n);
			} catch (i) {
				r(i);
			}
			else e.value(n);
		}
		_deliverQueue(e) {
			const t = e.current._listeners;
			for (; e.i < e.end;) this._deliver(t[e.i++], e.value);
			e.reset();
		}
		fire(e) {
			if (this._deliveryQueue?.current && (this._deliverQueue(this._deliveryQueue), this._perfMon?.stop()), this._perfMon?.start(this._size), this._listeners) if (this._listeners instanceof x) this._deliver(this._listeners, e);
			else {
				const t = this._deliveryQueue;
				t.enqueue(this, e, this._listeners.length), this._deliverQueue(t);
			}
			this._perfMon?.stop();
		}
		hasListeners() {
			return this._size > 0;
		}
	}, A = class {
		constructor() {
			this.i = -1, this.end = 0;
		}
		enqueue(e, t, n) {
			this.i = 0, this.end = n, this.current = e, this.value = t;
		}
		reset() {
			this.i = this.end, this.current = void 0, this.value = void 0;
		}
	};
	function k() {
		return globalThis._VSCODE_NLS_LANGUAGE;
	}
	const R = "pseudo" === k() || "undefined" != typeof document && document.location && "string" == typeof document.location.hash && document.location.hash.indexOf("pseudo=true") >= 0;
	function T(e, t) {
		let n;
		return n = 0 === t.length ? e : e.replace(/\{(\d+)\}/g, (e, n) => {
			const r = t[n[0]];
			let i = e;
			return "string" == typeof r ? i = r : "number" != typeof r && "boolean" != typeof r && null != r || (i = String(r)), i;
		}), R && (n = "［" + n.replace(/[aouei]/g, "$&$&") + "］"), n;
	}
	function M(e, t, ...n) {
		return T("number" == typeof e ? function(e, t) {
			const n = globalThis._VSCODE_NLS_MESSAGES?.[e];
			if ("string" != typeof n) {
				if ("string" == typeof t) return t;
				throw new Error(`!!! NLS MISSING: ${e} !!!`);
			}
			return n;
		}(e, t) : t, n);
	}
	let O, I = !1, P = !1, V = !1, D = !1;
	const $ = globalThis;
	let U;
	void 0 !== $.vscode && void 0 !== $.vscode.process ? U = $.vscode.process : "undefined" != typeof process && "string" == typeof process?.versions?.node && (U = process);
	const j = "string" == typeof U?.versions?.electron && "renderer" === U?.type;
	if ("object" == typeof U) {
		I = "win32" === U.platform, P = "darwin" === U.platform, V = "linux" === U.platform, V && U.env.SNAP && U.env.SNAP_REVISION, U.env.CI || U.env.BUILD_ARTIFACTSTAGINGDIRECTORY || U.env.GITHUB_WORKSPACE;
		const e = U.env.VSCODE_NLS_CONFIG;
		if (e) try {
			const t = JSON.parse(e);
			t.userLocale, t.osLocale, t.resolvedLanguage, t.languagePack;
		} catch (Jl) {}
	} else "object" != typeof navigator || j || (O = navigator.userAgent, I = O.indexOf("Windows") >= 0, P = O.indexOf("Macintosh") >= 0, (O.indexOf("Macintosh") >= 0 || O.indexOf("iPad") >= 0 || O.indexOf("iPhone") >= 0) && navigator.maxTouchPoints && navigator.maxTouchPoints, V = O.indexOf("Linux") >= 0, O?.indexOf("Mobi"), D = !0, k(), navigator.language.toLowerCase());
	const z = I, H = P, G = (D && "function" == typeof $.importScripts && $.origin, O), J = "function" == typeof $.postMessage && !$.importScripts;
	(() => {
		if (J) {
			const e = [];
			$.addEventListener("message", (t) => {
				if (t.data && t.data.vscodeScheduleAsyncWork) for (let n = 0, r = e.length; n < r; n++) {
					const r = e[n];
					if (r.id === t.data.vscodeScheduleAsyncWork) return e.splice(n, 1), void r.callback();
				}
			});
			let t = 0;
			return (n) => {
				const r = ++t;
				e.push({
					id: r,
					callback: n
				}), $.postMessage({ vscodeScheduleAsyncWork: r }, "*");
			};
		}
		return (e) => setTimeout(e);
	})();
	const Q = !!(G && G.indexOf("Chrome") >= 0);
	G && G.indexOf("Firefox"), !Q && G && G.indexOf("Safari"), G && G.indexOf("Edg/"), G && G.indexOf("Android");
	function Z(e) {
		return e;
	}
	var Y, ee = class {
		constructor(e, t) {
			this.lastCache = void 0, this.lastArgKey = void 0, "function" == typeof e ? (this._fn = e, this._computeKey = Z) : (this._fn = t, this._computeKey = e.getCacheKey);
		}
		get(e) {
			const t = this._computeKey(e);
			return this.lastArgKey !== t && (this.lastArgKey = t, this.lastCache = this._fn(e)), this.lastCache;
		}
	};
	(function(e) {
		e[e.Uninitialized = 0] = "Uninitialized", e[e.Running = 1] = "Running", e[e.Completed = 2] = "Completed";
	})(Y || (Y = {}));
	var te = class {
		constructor(e) {
			this.executor = e, this._state = Y.Uninitialized;
		}
		get value() {
			if (this._state === Y.Uninitialized) {
				this._state = Y.Running;
				try {
					this._value = this.executor();
				} catch (e) {
					this._error = e;
				} finally {
					this._state = Y.Completed;
				}
			} else if (this._state === Y.Running) throw new Error("Cannot read the value of a lazy that is being initialized");
			if (this._error) throw this._error;
			return this._value;
		}
		get rawValue() {
			return this._value;
		}
	};
	function ne(e) {
		return e >= 65 && e <= 90;
	}
	function re(e) {
		return 55296 <= e && e <= 56319;
	}
	function ie(e) {
		return 56320 <= e && e <= 57343;
	}
	function se(e, t) {
		return t - 56320 + (e - 55296 << 10) + 65536;
	}
	function oe(e, t, n) {
		const r = e.charCodeAt(n);
		if (re(r) && n + 1 < t) {
			const t = e.charCodeAt(n + 1);
			if (ie(t)) return se(r, t);
		}
		return r;
	}
	const ae = /^[\t\n\r\x20-\x7E]*$/;
	function le(e) {
		return ae.test(e);
	}
	(class e {
		static {
			this._INSTANCE = null;
		}
		static getInstance() {
			return e._INSTANCE || (e._INSTANCE = new e()), e._INSTANCE;
		}
		constructor() {
			this._data = JSON.parse("[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]");
		}
		getGraphemeBreakType(e) {
			if (e < 32) return 10 === e ? 3 : 13 === e ? 2 : 4;
			if (e < 127) return 0;
			const t = this._data, n = t.length / 3;
			let r = 1;
			for (; r <= n;) if (e < t[3 * r]) r *= 2;
			else {
				if (!(e > t[3 * r + 1])) return t[3 * r + 2];
				r = 2 * r + 1;
			}
			return 0;
		}
	});
	var ue = class e {
		static {
			this.ambiguousCharacterData = new te(() => JSON.parse("{\"_common\":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,1523,96,8242,96,1370,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,118002,50,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,118003,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,118004,52,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,118005,53,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,118006,54,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,118007,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,118008,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,118009,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,117974,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,117975,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71913,67,71922,67,65315,67,8557,67,8450,67,8493,67,117976,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,117977,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,117978,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,117979,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,117980,71,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,117981,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,117983,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,117984,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,118001,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,117982,108,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,117985,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,117986,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,117987,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,118000,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,117988,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,117989,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,117990,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,117991,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,117992,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,117993,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,117994,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,117995,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71910,87,71919,87,117996,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,117997,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,117998,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,71909,90,66293,90,65338,90,8484,90,8488,90,117999,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65283,35,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],\"_default\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"cs\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"de\":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"es\":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"fr\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"it\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"ja\":[8211,45,8218,44,65281,33,8216,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65292,44,65297,49,65307,59],\"ko\":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"pl\":[65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"pt-BR\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"qps-ploc\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"ru\":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"tr\":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],\"zh-hans\":[160,32,65374,126,8218,44,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65297,49],\"zh-hant\":[8211,45,65374,126,8218,44,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89]}"));
		}
		static {
			this.cache = new ee({ getCacheKey: JSON.stringify }, (t) => {
				function n(e) {
					const t = /* @__PURE__ */ new Map();
					for (let n = 0; n < e.length; n += 2) t.set(e[n], e[n + 1]);
					return t;
				}
				function r(e, t) {
					if (!e) return t;
					const n = /* @__PURE__ */ new Map();
					for (const [r, i] of e) t.has(r) && n.set(r, i);
					return n;
				}
				const i = this.ambiguousCharacterData.value;
				let s, o = t.filter((e) => !e.startsWith("_") && Object.hasOwn(i, e));
				0 === o.length && (o = ["_default"]);
				for (const e of o) s = r(s, n(i[e]));
				return new e(function(e, t) {
					const n = new Map(e);
					for (const [r, i] of t) n.set(r, i);
					return n;
				}(n(i._common), s));
			});
		}
		static getInstance(t) {
			return e.cache.get(Array.from(t));
		}
		static {
			this._locales = new te(() => Object.keys(e.ambiguousCharacterData.value).filter((e) => !e.startsWith("_")));
		}
		static getLocales() {
			return e._locales.value;
		}
		constructor(e) {
			this.confusableDictionary = e;
		}
		isAmbiguous(e) {
			return this.confusableDictionary.has(e);
		}
		getPrimaryConfusable(e) {
			return this.confusableDictionary.get(e);
		}
		getConfusableCodePoints() {
			return new Set(this.confusableDictionary.keys());
		}
	}, ce = class e {
		static getRawData() {
			return JSON.parse("{\"_common\":[11,12,13,127,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999],\"cs\":[173,8203,12288],\"de\":[173,8203,12288],\"es\":[8203,12288],\"fr\":[173,8203,12288],\"it\":[160,173,12288],\"ja\":[173],\"ko\":[173,12288],\"pl\":[173,8203,12288],\"pt-BR\":[173,8203,12288],\"qps-ploc\":[160,173,8203,12288],\"ru\":[173,12288],\"tr\":[160,173,8203,12288],\"zh-hans\":[160,173,8203,12288],\"zh-hant\":[173,12288]}");
		}
		static {
			this._data = void 0;
		}
		static getData() {
			return this._data || (this._data = new Set([...Object.values(e.getRawData())].flat())), this._data;
		}
		static isInvisibleCharacter(t) {
			return e.getData().has(t);
		}
		static get codePoints() {
			return e.getData();
		}
	};
	const he = "default";
	var de = class {
		constructor(e, t, n, r, i) {
			this.vsWorker = e, this.req = t, this.channel = n, this.method = r, this.args = i, this.type = 0;
		}
	}, fe = class {
		constructor(e, t, n, r) {
			this.vsWorker = e, this.seq = t, this.res = n, this.err = r, this.type = 1;
		}
	}, me = class {
		constructor(e, t, n, r, i) {
			this.vsWorker = e, this.req = t, this.channel = n, this.eventName = r, this.arg = i, this.type = 2;
		}
	}, ge = class {
		constructor(e, t, n) {
			this.vsWorker = e, this.req = t, this.event = n, this.type = 3;
		}
	}, pe = class {
		constructor(e, t) {
			this.vsWorker = e, this.req = t, this.type = 4;
		}
	}, be = class {
		constructor(e) {
			this._workerId = -1, this._handler = e, this._lastSentReq = 0, this._pendingReplies = Object.create(null), this._pendingEmitters = /* @__PURE__ */ new Map(), this._pendingEvents = /* @__PURE__ */ new Map();
		}
		setWorkerId(e) {
			this._workerId = e;
		}
		async sendMessage(e, t, n) {
			const r = String(++this._lastSentReq);
			return new Promise((i, s) => {
				this._pendingReplies[r] = {
					resolve: i,
					reject: s
				}, this._send(new de(this._workerId, r, e, t, n));
			});
		}
		listen(e, t, n) {
			let r = null;
			const i = new E({
				onWillAddFirstListener: () => {
					r = String(++this._lastSentReq), this._pendingEmitters.set(r, i), this._send(new me(this._workerId, r, e, t, n));
				},
				onDidRemoveLastListener: () => {
					this._pendingEmitters.delete(r), this._send(new pe(this._workerId, r)), r = null;
				}
			});
			return i.event;
		}
		handleMessage(e) {
			e && e.vsWorker && (-1 !== this._workerId && e.vsWorker !== this._workerId || this._handleMessage(e));
		}
		createProxyToRemoteChannel(e, t) {
			return new Proxy(Object.create(null), { get: (n, r) => ("string" != typeof r || n[r] || (ve(r) ? n[r] = (t) => this.listen(e, r, t) : ye(r) ? n[r] = this.listen(e, r, void 0) : 36 === r.charCodeAt(0) && (n[r] = async (...n) => (await t?.(), this.sendMessage(e, r, n)))), n[r]) });
		}
		_handleMessage(e) {
			switch (e.type) {
				case 1: return this._handleReplyMessage(e);
				case 0: return this._handleRequestMessage(e);
				case 2: return this._handleSubscribeEventMessage(e);
				case 3: return this._handleEventMessage(e);
				case 4: return this._handleUnsubscribeEventMessage(e);
			}
		}
		_handleReplyMessage(e) {
			if (!this._pendingReplies[e.seq]) return;
			const t = this._pendingReplies[e.seq];
			if (delete this._pendingReplies[e.seq], e.err) {
				let n = e.err;
				if (e.err.$isError) {
					const t = /* @__PURE__ */ new Error();
					t.name = e.err.name, t.message = e.err.message, t.stack = e.err.stack, n = t;
				}
				t.reject(n);
				return;
			}
			t.resolve(e.res);
		}
		_handleRequestMessage(e) {
			const t = e.req;
			this._handler.handleMessage(e.channel, e.method, e.args).then((e) => {
				this._send(new fe(this._workerId, t, e, void 0));
			}, (e) => {
				e.detail instanceof Error && (e.detail = n(e.detail)), this._send(new fe(this._workerId, t, void 0, n(e)));
			});
		}
		_handleSubscribeEventMessage(e) {
			const t = e.req, n = this._handler.handleEvent(e.channel, e.eventName, e.arg)((e) => {
				this._send(new ge(this._workerId, t, e));
			});
			this._pendingEvents.set(t, n);
		}
		_handleEventMessage(e) {
			this._pendingEmitters.has(e.req) && this._pendingEmitters.get(e.req).fire(e.event);
		}
		_handleUnsubscribeEventMessage(e) {
			this._pendingEvents.has(e.req) && (this._pendingEvents.get(e.req).dispose(), this._pendingEvents.delete(e.req));
		}
		_send(e) {
			const t = [];
			if (0 === e.type) for (let n = 0; n < e.args.length; n++) {
				const r = e.args[n];
				r instanceof ArrayBuffer && t.push(r);
			}
			else 1 === e.type && e.res instanceof ArrayBuffer && t.push(e.res);
			this._handler.sendMessage(e, t);
		}
	};
	function ye(e) {
		return "o" === e[0] && "n" === e[1] && ne(e.charCodeAt(2));
	}
	function ve(e) {
		return /^onDynamic/.test(e) && ne(e.charCodeAt(9));
	}
	var we = class {
		constructor(e, t) {
			this._localChannels = /* @__PURE__ */ new Map(), this._remoteChannels = /* @__PURE__ */ new Map(), this._protocol = new be({
				sendMessage: (t, n) => {
					e(t, n);
				},
				handleMessage: (e, t, n) => this._handleMessage(e, t, n),
				handleEvent: (e, t, n) => this._handleEvent(e, t, n)
			}), this.requestHandler = t(this);
		}
		onmessage(e) {
			this._protocol.handleMessage(e);
		}
		_handleMessage(e, t, n) {
			if (e === he && "$initialize" === t) return this.initialize(n[0]);
			const r = e === he ? this.requestHandler : this._localChannels.get(e);
			if (!r) return Promise.reject(/* @__PURE__ */ new Error(`Missing channel ${e} on worker thread`));
			const i = r[t];
			if ("function" != typeof i) return Promise.reject(/* @__PURE__ */ new Error(`Missing method ${t} on worker thread channel ${e}`));
			try {
				return Promise.resolve(i.apply(r, n));
			} catch (Jl) {
				return Promise.reject(Jl);
			}
		}
		_handleEvent(e, t, n) {
			const r = e === he ? this.requestHandler : this._localChannels.get(e);
			if (!r) throw new Error(`Missing channel ${e} on worker thread`);
			if (ve(t)) {
				const e = r[t];
				if ("function" != typeof e) throw new Error(`Missing dynamic event ${t} on request handler.`);
				const i = e.call(r, n);
				if ("function" != typeof i) throw new Error(`Missing dynamic event ${t} on request handler.`);
				return i;
			}
			if (ye(t)) {
				const e = r[t];
				if ("function" != typeof e) throw new Error(`Missing event ${t} on request handler.`);
				return e;
			}
			throw new Error(`Malformed event name ${t}`);
		}
		getChannel(e) {
			if (!this._remoteChannels.has(e)) {
				const t = this._protocol.createProxyToRemoteChannel(e);
				this._remoteChannels.set(e, t);
			}
			return this._remoteChannels.get(e);
		}
		async initialize(e) {
			this._protocol.setWorkerId(e);
		}
	};
	let _e = !1;
	var Ce = class {
		constructor(e, t, n, r) {
			this.originalStart = e, this.originalLength = t, this.modifiedStart = n, this.modifiedLength = r;
		}
		getOriginalEnd() {
			return this.originalStart + this.originalLength;
		}
		getModifiedEnd() {
			return this.modifiedStart + this.modifiedLength;
		}
	};
	const Se = "undefined" != typeof Buffer;
	let Le;
	new te(() => new Uint8Array(256));
	var Ne = class e {
		static wrap(t) {
			return Se && !Buffer.isBuffer(t) && (t = Buffer.from(t.buffer, t.byteOffset, t.byteLength)), new e(t);
		}
		constructor(e) {
			this.buffer = e, this.byteLength = this.buffer.byteLength;
		}
		toString() {
			return Se ? this.buffer.toString() : (Le || (Le = new TextDecoder()), Le.decode(this.buffer));
		}
	};
	const xe = "0123456789abcdef";
	function Ee(e, t) {
		return (t << 5) - t + e | 0;
	}
	function Ae(e, t) {
		t = Ee(149417, t);
		for (let n = 0, r = e.length; n < r; n++) t = Ee(e.charCodeAt(n), t);
		return t;
	}
	function ke(e, t, n = 32) {
		const r = n - t;
		return (e << t | (~((1 << r) - 1) & e) >>> r) >>> 0;
	}
	function Re(e, t = 32) {
		return e instanceof ArrayBuffer ? function({ buffer: e }) {
			let t = "";
			for (let n = 0; n < e.length; n++) {
				const r = e[n];
				t += xe[r >>> 4], t += xe[15 & r];
			}
			return t;
		}(Ne.wrap(new Uint8Array(e))) : (e >>> 0).toString(16).padStart(t / 4, "0");
	}
	(class e {
		static {
			this._bigBlock32 = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(320));
		}
		constructor() {
			this._h0 = 1732584193, this._h1 = 4023233417, this._h2 = 2562383102, this._h3 = 271733878, this._h4 = 3285377520, this._buff = new Uint8Array(67), this._buffDV = new DataView(this._buff.buffer), this._buffLen = 0, this._totalLen = 0, this._leftoverHighSurrogate = 0, this._finished = !1;
		}
		update(e) {
			const t = e.length;
			if (0 === t) return;
			const n = this._buff;
			let r, i, s = this._buffLen, o = this._leftoverHighSurrogate;
			for (0 !== o ? (r = o, i = -1, o = 0) : (r = e.charCodeAt(0), i = 0);;) {
				let a = r;
				if (re(r)) {
					if (!(i + 1 < t)) {
						o = r;
						break;
					}
					{
						const t = e.charCodeAt(i + 1);
						ie(t) ? (i++, a = se(r, t)) : a = 65533;
					}
				} else ie(r) && (a = 65533);
				if (s = this._push(n, s, a), i++, !(i < t)) break;
				r = e.charCodeAt(i);
			}
			this._buffLen = s, this._leftoverHighSurrogate = o;
		}
		_push(e, t, n) {
			return n < 128 ? e[t++] = n : n < 2048 ? (e[t++] = 192 | (1984 & n) >>> 6, e[t++] = 128 | (63 & n) >>> 0) : n < 65536 ? (e[t++] = 224 | (61440 & n) >>> 12, e[t++] = 128 | (4032 & n) >>> 6, e[t++] = 128 | (63 & n) >>> 0) : (e[t++] = 240 | (1835008 & n) >>> 18, e[t++] = 128 | (258048 & n) >>> 12, e[t++] = 128 | (4032 & n) >>> 6, e[t++] = 128 | (63 & n) >>> 0), t >= 64 && (this._step(), t -= 64, this._totalLen += 64, e[0] = e[64], e[1] = e[65], e[2] = e[66]), t;
		}
		digest() {
			return this._finished || (this._finished = !0, this._leftoverHighSurrogate && (this._leftoverHighSurrogate = 0, this._buffLen = this._push(this._buff, this._buffLen, 65533)), this._totalLen += this._buffLen, this._wrapUp()), Re(this._h0) + Re(this._h1) + Re(this._h2) + Re(this._h3) + Re(this._h4);
		}
		_wrapUp() {
			this._buff[this._buffLen++] = 128, this._buff.subarray(this._buffLen).fill(0), this._buffLen > 56 && (this._step(), this._buff.fill(0));
			const e = 8 * this._totalLen;
			this._buffDV.setUint32(56, Math.floor(e / 4294967296), !1), this._buffDV.setUint32(60, e % 4294967296, !1), this._step();
		}
		_step() {
			const t = e._bigBlock32, n = this._buffDV;
			for (let e = 0; e < 64; e += 4) t.setUint32(e, n.getUint32(e, !1), !1);
			for (let e = 64; e < 320; e += 4) t.setUint32(e, ke(t.getUint32(e - 12, !1) ^ t.getUint32(e - 32, !1) ^ t.getUint32(e - 56, !1) ^ t.getUint32(e - 64, !1), 1), !1);
			let r, i, s, o = this._h0, a = this._h1, l = this._h2, u = this._h3, c = this._h4;
			for (let e = 0; e < 80; e++) e < 20 ? (r = a & l | ~a & u, i = 1518500249) : e < 40 ? (r = a ^ l ^ u, i = 1859775393) : e < 60 ? (r = a & l | a & u | l & u, i = 2400959708) : (r = a ^ l ^ u, i = 3395469782), s = ke(o, 5) + r + c + i + t.getUint32(4 * e, !1) & 4294967295, c = u, u = l, l = ke(a, 30), a = o, o = s;
			this._h0 = this._h0 + o & 4294967295, this._h1 = this._h1 + a & 4294967295, this._h2 = this._h2 + l & 4294967295, this._h3 = this._h3 + u & 4294967295, this._h4 = this._h4 + c & 4294967295;
		}
	});
	var Te = class {
		constructor(e) {
			this.source = e;
		}
		getElements() {
			const e = this.source, t = new Int32Array(e.length);
			for (let n = 0, r = e.length; n < r; n++) t[n] = e.charCodeAt(n);
			return t;
		}
	};
	function Me(e, t, n) {
		return new Ve(new Te(e), new Te(t)).ComputeDiff(n).changes;
	}
	var Oe = class {
		static Assert(e, t) {
			if (!e) throw new Error(t);
		}
	}, Ie = class {
		static Copy(e, t, n, r, i) {
			for (let s = 0; s < i; s++) n[r + s] = e[t + s];
		}
		static Copy2(e, t, n, r, i) {
			for (let s = 0; s < i; s++) n[r + s] = e[t + s];
		}
	}, Pe = class {
		constructor() {
			this.m_changes = [], this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824, this.m_originalCount = 0, this.m_modifiedCount = 0;
		}
		MarkNextChange() {
			(this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.m_changes.push(new Ce(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount)), this.m_originalCount = 0, this.m_modifiedCount = 0, this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824;
		}
		AddOriginalElement(e, t) {
			this.m_originalStart = Math.min(this.m_originalStart, e), this.m_modifiedStart = Math.min(this.m_modifiedStart, t), this.m_originalCount++;
		}
		AddModifiedElement(e, t) {
			this.m_originalStart = Math.min(this.m_originalStart, e), this.m_modifiedStart = Math.min(this.m_modifiedStart, t), this.m_modifiedCount++;
		}
		getChanges() {
			return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes;
		}
		getReverseChanges() {
			return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes.reverse(), this.m_changes;
		}
	}, Ve = class e {
		constructor(t, n, r = null) {
			this.ContinueProcessingPredicate = r, this._originalSequence = t, this._modifiedSequence = n;
			const [i, s, o] = e._getElements(t), [a, l, u] = e._getElements(n);
			this._hasStrings = o && u, this._originalStringElements = i, this._originalElementsOrHash = s, this._modifiedStringElements = a, this._modifiedElementsOrHash = l, this.m_forwardHistory = [], this.m_reverseHistory = [];
		}
		static _isStringArray(e) {
			return e.length > 0 && "string" == typeof e[0];
		}
		static _getElements(t) {
			const n = t.getElements();
			if (e._isStringArray(n)) {
				const e = new Int32Array(n.length);
				for (let t = 0, r = n.length; t < r; t++) e[t] = Ae(n[t], 0);
				return [
					n,
					e,
					!0
				];
			}
			return n instanceof Int32Array ? [
				[],
				n,
				!1
			] : [
				[],
				new Int32Array(n),
				!1
			];
		}
		ElementsAreEqual(e, t) {
			return this._originalElementsOrHash[e] === this._modifiedElementsOrHash[t] && (!this._hasStrings || this._originalStringElements[e] === this._modifiedStringElements[t]);
		}
		ElementsAreStrictEqual(t, n) {
			return !!this.ElementsAreEqual(t, n) && e._getStrictElement(this._originalSequence, t) === e._getStrictElement(this._modifiedSequence, n);
		}
		static _getStrictElement(e, t) {
			return "function" == typeof e.getStrictElement ? e.getStrictElement(t) : null;
		}
		OriginalElementsAreEqual(e, t) {
			return this._originalElementsOrHash[e] === this._originalElementsOrHash[t] && (!this._hasStrings || this._originalStringElements[e] === this._originalStringElements[t]);
		}
		ModifiedElementsAreEqual(e, t) {
			return this._modifiedElementsOrHash[e] === this._modifiedElementsOrHash[t] && (!this._hasStrings || this._modifiedStringElements[e] === this._modifiedStringElements[t]);
		}
		ComputeDiff(e) {
			return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, e);
		}
		_ComputeDiff(e, t, n, r, i) {
			const s = [!1];
			let o = this.ComputeDiffRecursive(e, t, n, r, s);
			return i && (o = this.PrettifyChanges(o)), {
				quitEarly: s[0],
				changes: o
			};
		}
		ComputeDiffRecursive(e, t, n, r, i) {
			for (i[0] = !1; e <= t && n <= r && this.ElementsAreEqual(e, n);) e++, n++;
			for (; t >= e && r >= n && this.ElementsAreEqual(t, r);) t--, r--;
			if (e > t || n > r) {
				let i;
				return n <= r ? (Oe.Assert(e === t + 1, "originalStart should only be one more than originalEnd"), i = [new Ce(e, 0, n, r - n + 1)]) : e <= t ? (Oe.Assert(n === r + 1, "modifiedStart should only be one more than modifiedEnd"), i = [new Ce(e, t - e + 1, n, 0)]) : (Oe.Assert(e === t + 1, "originalStart should only be one more than originalEnd"), Oe.Assert(n === r + 1, "modifiedStart should only be one more than modifiedEnd"), i = []), i;
			}
			const s = [0], o = [0], a = this.ComputeRecursionPoint(e, t, n, r, s, o, i), l = s[0], u = o[0];
			if (null !== a) return a;
			if (!i[0]) {
				const s = this.ComputeDiffRecursive(e, l, n, u, i);
				let o = [];
				return o = i[0] ? [new Ce(l + 1, t - (l + 1) + 1, u + 1, r - (u + 1) + 1)] : this.ComputeDiffRecursive(l + 1, t, u + 1, r, i), this.ConcatenateChanges(s, o);
			}
			return [new Ce(e, t - e + 1, n, r - n + 1)];
		}
		WALKTRACE(e, t, n, r, i, s, o, a, l, u, c, h, d, f, m, g, p, b) {
			let y = null, v = null, w = new Pe(), _ = t, C = n, S = d[0] - g[0] - r, L = -1073741824, N = this.m_forwardHistory.length - 1;
			do {
				const t = S + e;
				t === _ || t < C && l[t - 1] < l[t + 1] ? (f = (c = l[t + 1]) - S - r, c < L && w.MarkNextChange(), L = c, w.AddModifiedElement(c + 1, f), S = t + 1 - e) : (f = (c = l[t - 1] + 1) - S - r, c < L && w.MarkNextChange(), L = c - 1, w.AddOriginalElement(c, f + 1), S = t - 1 - e), N >= 0 && (e = (l = this.m_forwardHistory[N])[0], _ = 1, C = l.length - 1);
			} while (--N >= -1);
			if (y = w.getReverseChanges(), b[0]) {
				let e = d[0] + 1, t = g[0] + 1;
				if (null !== y && y.length > 0) {
					const n = y[y.length - 1];
					e = Math.max(e, n.getOriginalEnd()), t = Math.max(t, n.getModifiedEnd());
				}
				v = [new Ce(e, h - e + 1, t, m - t + 1)];
			} else {
				w = new Pe(), _ = s, C = o, S = d[0] - g[0] - a, L = 1073741824, N = p ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
				do {
					const e = S + i;
					e === _ || e < C && u[e - 1] >= u[e + 1] ? (f = (c = u[e + 1] - 1) - S - a, c > L && w.MarkNextChange(), L = c + 1, w.AddOriginalElement(c + 1, f + 1), S = e + 1 - i) : (f = (c = u[e - 1]) - S - a, c > L && w.MarkNextChange(), L = c, w.AddModifiedElement(c + 1, f + 1), S = e - 1 - i), N >= 0 && (i = (u = this.m_reverseHistory[N])[0], _ = 1, C = u.length - 1);
				} while (--N >= -1);
				v = w.getChanges();
			}
			return this.ConcatenateChanges(y, v);
		}
		ComputeRecursionPoint(e, t, n, r, i, s, o) {
			let a = 0, l = 0, u = 0, c = 0, h = 0, d = 0;
			e--, n--, i[0] = 0, s[0] = 0, this.m_forwardHistory = [], this.m_reverseHistory = [];
			const f = t - e + (r - n), m = f + 1, g = new Int32Array(m), p = new Int32Array(m), b = r - n, y = t - e, v = e - n, w = t - r, _ = (y - b) % 2 == 0;
			g[b] = e, p[y] = t, o[0] = !1;
			for (let C = 1; C <= f / 2 + 1; C++) {
				let f = 0, S = 0;
				u = this.ClipDiagonalBound(b - C, C, b, m), c = this.ClipDiagonalBound(b + C, C, b, m);
				for (let e = u; e <= c; e += 2) {
					a = e === u || e < c && g[e - 1] < g[e + 1] ? g[e + 1] : g[e - 1] + 1, l = a - (e - b) - v;
					const n = a;
					for (; a < t && l < r && this.ElementsAreEqual(a + 1, l + 1);) a++, l++;
					if (g[e] = a, a + l > f + S && (f = a, S = l), !_ && Math.abs(e - y) <= C - 1 && a >= p[e]) return i[0] = a, s[0] = l, n <= p[e] && C <= 1448 ? this.WALKTRACE(b, u, c, v, y, h, d, w, g, p, a, t, i, l, r, s, _, o) : null;
				}
				const L = (f - e + (S - n) - C) / 2;
				if (null !== this.ContinueProcessingPredicate && !this.ContinueProcessingPredicate(f, L)) return o[0] = !0, i[0] = f, s[0] = S, L > 0 && C <= 1448 ? this.WALKTRACE(b, u, c, v, y, h, d, w, g, p, a, t, i, l, r, s, _, o) : (e++, n++, [new Ce(e, t - e + 1, n, r - n + 1)]);
				h = this.ClipDiagonalBound(y - C, C, y, m), d = this.ClipDiagonalBound(y + C, C, y, m);
				for (let m = h; m <= d; m += 2) {
					a = m === h || m < d && p[m - 1] >= p[m + 1] ? p[m + 1] - 1 : p[m - 1], l = a - (m - y) - w;
					const f = a;
					for (; a > e && l > n && this.ElementsAreEqual(a, l);) a--, l--;
					if (p[m] = a, _ && Math.abs(m - b) <= C && a <= g[m]) return i[0] = a, s[0] = l, f >= g[m] && C <= 1448 ? this.WALKTRACE(b, u, c, v, y, h, d, w, g, p, a, t, i, l, r, s, _, o) : null;
				}
				if (C <= 1447) {
					let e = new Int32Array(c - u + 2);
					e[0] = b - u + 1, Ie.Copy2(g, u, e, 1, c - u + 1), this.m_forwardHistory.push(e), e = new Int32Array(d - h + 2), e[0] = y - h + 1, Ie.Copy2(p, h, e, 1, d - h + 1), this.m_reverseHistory.push(e);
				}
			}
			return this.WALKTRACE(b, u, c, v, y, h, d, w, g, p, a, t, i, l, r, s, _, o);
		}
		PrettifyChanges(e) {
			for (let t = 0; t < e.length; t++) {
				const n = e[t], r = t < e.length - 1 ? e[t + 1].originalStart : this._originalElementsOrHash.length, i = t < e.length - 1 ? e[t + 1].modifiedStart : this._modifiedElementsOrHash.length, s = n.originalLength > 0, o = n.modifiedLength > 0;
				for (; n.originalStart + n.originalLength < r && n.modifiedStart + n.modifiedLength < i && (!s || this.OriginalElementsAreEqual(n.originalStart, n.originalStart + n.originalLength)) && (!o || this.ModifiedElementsAreEqual(n.modifiedStart, n.modifiedStart + n.modifiedLength));) {
					const e = this.ElementsAreStrictEqual(n.originalStart, n.modifiedStart);
					if (this.ElementsAreStrictEqual(n.originalStart + n.originalLength, n.modifiedStart + n.modifiedLength) && !e) break;
					n.originalStart++, n.modifiedStart++;
				}
				const a = [null];
				t < e.length - 1 && this.ChangesOverlap(e[t], e[t + 1], a) && (e[t] = a[0], e.splice(t + 1, 1), t--);
			}
			for (let t = e.length - 1; t >= 0; t--) {
				const n = e[t];
				let r = 0, i = 0;
				if (t > 0) {
					const n = e[t - 1];
					r = n.originalStart + n.originalLength, i = n.modifiedStart + n.modifiedLength;
				}
				const s = n.originalLength > 0, o = n.modifiedLength > 0;
				let a = 0, l = this._boundaryScore(n.originalStart, n.originalLength, n.modifiedStart, n.modifiedLength);
				for (let e = 1;; e++) {
					const t = n.originalStart - e, u = n.modifiedStart - e;
					if (t < r || u < i) break;
					if (s && !this.OriginalElementsAreEqual(t, t + n.originalLength)) break;
					if (o && !this.ModifiedElementsAreEqual(u, u + n.modifiedLength)) break;
					const c = (t === r && u === i ? 5 : 0) + this._boundaryScore(t, n.originalLength, u, n.modifiedLength);
					c > l && (l = c, a = e);
				}
				n.originalStart -= a, n.modifiedStart -= a;
				const u = [null];
				t > 0 && this.ChangesOverlap(e[t - 1], e[t], u) && (e[t - 1] = u[0], e.splice(t, 1), t++);
			}
			if (this._hasStrings) for (let t = 1, n = e.length; t < n; t++) {
				const n = e[t - 1], r = e[t], i = r.originalStart - n.originalStart - n.originalLength, s = n.originalStart, o = r.originalStart + r.originalLength, a = o - s, l = n.modifiedStart, u = r.modifiedStart + r.modifiedLength, c = u - l;
				if (i < 5 && a < 20 && c < 20) {
					const e = this._findBetterContiguousSequence(s, a, l, c, i);
					if (e) {
						const [t, s] = e;
						t === n.originalStart + n.originalLength && s === n.modifiedStart + n.modifiedLength || (n.originalLength = t - n.originalStart, n.modifiedLength = s - n.modifiedStart, r.originalStart = t + i, r.modifiedStart = s + i, r.originalLength = o - r.originalStart, r.modifiedLength = u - r.modifiedStart);
					}
				}
			}
			return e;
		}
		_findBetterContiguousSequence(e, t, n, r, i) {
			if (t < i || r < i) return null;
			const s = e + t - i + 1, o = n + r - i + 1;
			let a = 0, l = 0, u = 0;
			for (let c = e; c < s; c++) for (let e = n; e < o; e++) {
				const t = this._contiguousSequenceScore(c, e, i);
				t > 0 && t > a && (a = t, l = c, u = e);
			}
			return a > 0 ? [l, u] : null;
		}
		_contiguousSequenceScore(e, t, n) {
			let r = 0;
			for (let i = 0; i < n; i++) {
				if (!this.ElementsAreEqual(e + i, t + i)) return 0;
				r += this._originalStringElements[e + i].length;
			}
			return r;
		}
		_OriginalIsBoundary(e) {
			return e <= 0 || e >= this._originalElementsOrHash.length - 1 || this._hasStrings && /^\s*$/.test(this._originalStringElements[e]);
		}
		_OriginalRegionIsBoundary(e, t) {
			if (this._OriginalIsBoundary(e) || this._OriginalIsBoundary(e - 1)) return !0;
			if (t > 0) {
				const n = e + t;
				if (this._OriginalIsBoundary(n - 1) || this._OriginalIsBoundary(n)) return !0;
			}
			return !1;
		}
		_ModifiedIsBoundary(e) {
			return e <= 0 || e >= this._modifiedElementsOrHash.length - 1 || this._hasStrings && /^\s*$/.test(this._modifiedStringElements[e]);
		}
		_ModifiedRegionIsBoundary(e, t) {
			if (this._ModifiedIsBoundary(e) || this._ModifiedIsBoundary(e - 1)) return !0;
			if (t > 0) {
				const n = e + t;
				if (this._ModifiedIsBoundary(n - 1) || this._ModifiedIsBoundary(n)) return !0;
			}
			return !1;
		}
		_boundaryScore(e, t, n, r) {
			return (this._OriginalRegionIsBoundary(e, t) ? 1 : 0) + (this._ModifiedRegionIsBoundary(n, r) ? 1 : 0);
		}
		ConcatenateChanges(e, t) {
			const n = [];
			if (0 === e.length || 0 === t.length) return t.length > 0 ? t : e;
			if (this.ChangesOverlap(e[e.length - 1], t[0], n)) {
				const r = new Array(e.length + t.length - 1);
				return Ie.Copy(e, 0, r, 0, e.length - 1), r[e.length - 1] = n[0], Ie.Copy(t, 1, r, e.length, t.length - 1), r;
			}
			{
				const n = new Array(e.length + t.length);
				return Ie.Copy(e, 0, n, 0, e.length), Ie.Copy(t, 0, n, e.length, t.length), n;
			}
		}
		ChangesOverlap(e, t, n) {
			if (Oe.Assert(e.originalStart <= t.originalStart, "Left change is not less than or equal to right change"), Oe.Assert(e.modifiedStart <= t.modifiedStart, "Left change is not less than or equal to right change"), e.originalStart + e.originalLength >= t.originalStart || e.modifiedStart + e.modifiedLength >= t.modifiedStart) {
				const r = e.originalStart;
				let i = e.originalLength;
				const s = e.modifiedStart;
				let o = e.modifiedLength;
				return e.originalStart + e.originalLength >= t.originalStart && (i = t.originalStart + t.originalLength - e.originalStart), e.modifiedStart + e.modifiedLength >= t.modifiedStart && (o = t.modifiedStart + t.modifiedLength - e.modifiedStart), n[0] = new Ce(r, i, s, o), !0;
			}
			return n[0] = null, !1;
		}
		ClipDiagonalBound(e, t, n, r) {
			if (e >= 0 && e < r) return e;
			const i = t % 2 == 0;
			return e < 0 ? i === (n % 2 == 0) ? 0 : 1 : i === ((r - n - 1) % 2 == 0) ? r - 1 : r - 2;
		}
	}, Fe = class e {
		constructor(e, t) {
			this.lineNumber = e, this.column = t;
		}
		with(t = this.lineNumber, n = this.column) {
			return t === this.lineNumber && n === this.column ? this : new e(t, n);
		}
		delta(e = 0, t = 0) {
			return this.with(Math.max(1, this.lineNumber + e), Math.max(1, this.column + t));
		}
		equals(t) {
			return e.equals(this, t);
		}
		static equals(e, t) {
			return !e && !t || !!e && !!t && e.lineNumber === t.lineNumber && e.column === t.column;
		}
		isBefore(t) {
			return e.isBefore(this, t);
		}
		static isBefore(e, t) {
			return e.lineNumber < t.lineNumber || !(t.lineNumber < e.lineNumber) && e.column < t.column;
		}
		isBeforeOrEqual(t) {
			return e.isBeforeOrEqual(this, t);
		}
		static isBeforeOrEqual(e, t) {
			return e.lineNumber < t.lineNumber || !(t.lineNumber < e.lineNumber) && e.column <= t.column;
		}
		static compare(e, t) {
			const n = 0 | e.lineNumber, r = 0 | t.lineNumber;
			return n === r ? (0 | e.column) - (0 | t.column) : n - r;
		}
		clone() {
			return new e(this.lineNumber, this.column);
		}
		toString() {
			return "(" + this.lineNumber + "," + this.column + ")";
		}
		static lift(t) {
			return new e(t.lineNumber, t.column);
		}
		static isIPosition(e) {
			return !!e && "number" == typeof e.lineNumber && "number" == typeof e.column;
		}
		toJSON() {
			return {
				lineNumber: this.lineNumber,
				column: this.column
			};
		}
	}, De = class e {
		constructor(e, t, n, r) {
			e > n || e === n && t > r ? (this.startLineNumber = n, this.startColumn = r, this.endLineNumber = e, this.endColumn = t) : (this.startLineNumber = e, this.startColumn = t, this.endLineNumber = n, this.endColumn = r);
		}
		isEmpty() {
			return e.isEmpty(this);
		}
		static isEmpty(e) {
			return e.startLineNumber === e.endLineNumber && e.startColumn === e.endColumn;
		}
		containsPosition(t) {
			return e.containsPosition(this, t);
		}
		static containsPosition(e, t) {
			return !(t.lineNumber < e.startLineNumber || t.lineNumber > e.endLineNumber) && !(t.lineNumber === e.startLineNumber && t.column < e.startColumn) && !(t.lineNumber === e.endLineNumber && t.column > e.endColumn);
		}
		static strictContainsPosition(e, t) {
			return !(t.lineNumber < e.startLineNumber || t.lineNumber > e.endLineNumber) && !(t.lineNumber === e.startLineNumber && t.column <= e.startColumn) && !(t.lineNumber === e.endLineNumber && t.column >= e.endColumn);
		}
		containsRange(t) {
			return e.containsRange(this, t);
		}
		static containsRange(e, t) {
			return !(t.startLineNumber < e.startLineNumber || t.endLineNumber < e.startLineNumber) && !(t.startLineNumber > e.endLineNumber || t.endLineNumber > e.endLineNumber) && !(t.startLineNumber === e.startLineNumber && t.startColumn < e.startColumn) && !(t.endLineNumber === e.endLineNumber && t.endColumn > e.endColumn);
		}
		strictContainsRange(t) {
			return e.strictContainsRange(this, t);
		}
		static strictContainsRange(e, t) {
			return !(t.startLineNumber < e.startLineNumber || t.endLineNumber < e.startLineNumber) && !(t.startLineNumber > e.endLineNumber || t.endLineNumber > e.endLineNumber) && !(t.startLineNumber === e.startLineNumber && t.startColumn <= e.startColumn) && !(t.endLineNumber === e.endLineNumber && t.endColumn >= e.endColumn);
		}
		plusRange(t) {
			return e.plusRange(this, t);
		}
		static plusRange(t, n) {
			let r, i, s, o;
			return n.startLineNumber < t.startLineNumber ? (r = n.startLineNumber, i = n.startColumn) : n.startLineNumber === t.startLineNumber ? (r = n.startLineNumber, i = Math.min(n.startColumn, t.startColumn)) : (r = t.startLineNumber, i = t.startColumn), n.endLineNumber > t.endLineNumber ? (s = n.endLineNumber, o = n.endColumn) : n.endLineNumber === t.endLineNumber ? (s = n.endLineNumber, o = Math.max(n.endColumn, t.endColumn)) : (s = t.endLineNumber, o = t.endColumn), new e(r, i, s, o);
		}
		intersectRanges(t) {
			return e.intersectRanges(this, t);
		}
		static intersectRanges(t, n) {
			let r = t.startLineNumber, i = t.startColumn, s = t.endLineNumber, o = t.endColumn;
			const a = n.startLineNumber, l = n.startColumn, u = n.endLineNumber, c = n.endColumn;
			return r < a ? (r = a, i = l) : r === a && (i = Math.max(i, l)), s > u ? (s = u, o = c) : s === u && (o = Math.min(o, c)), r > s || r === s && i > o ? null : new e(r, i, s, o);
		}
		equalsRange(t) {
			return e.equalsRange(this, t);
		}
		static equalsRange(e, t) {
			return !e && !t || !!e && !!t && e.startLineNumber === t.startLineNumber && e.startColumn === t.startColumn && e.endLineNumber === t.endLineNumber && e.endColumn === t.endColumn;
		}
		getEndPosition() {
			return e.getEndPosition(this);
		}
		static getEndPosition(e) {
			return new Fe(e.endLineNumber, e.endColumn);
		}
		getStartPosition() {
			return e.getStartPosition(this);
		}
		static getStartPosition(e) {
			return new Fe(e.startLineNumber, e.startColumn);
		}
		toString() {
			return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn + "]";
		}
		setEndPosition(t, n) {
			return new e(this.startLineNumber, this.startColumn, t, n);
		}
		setStartPosition(t, n) {
			return new e(t, n, this.endLineNumber, this.endColumn);
		}
		collapseToStart() {
			return e.collapseToStart(this);
		}
		static collapseToStart(t) {
			return new e(t.startLineNumber, t.startColumn, t.startLineNumber, t.startColumn);
		}
		collapseToEnd() {
			return e.collapseToEnd(this);
		}
		static collapseToEnd(t) {
			return new e(t.endLineNumber, t.endColumn, t.endLineNumber, t.endColumn);
		}
		delta(t) {
			return new e(this.startLineNumber + t, this.startColumn, this.endLineNumber + t, this.endColumn);
		}
		isSingleLine() {
			return this.startLineNumber === this.endLineNumber;
		}
		static fromPositions(t, n = t) {
			return new e(t.lineNumber, t.column, n.lineNumber, n.column);
		}
		static lift(t) {
			return t ? new e(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : null;
		}
		static isIRange(e) {
			return !!e && "number" == typeof e.startLineNumber && "number" == typeof e.startColumn && "number" == typeof e.endLineNumber && "number" == typeof e.endColumn;
		}
		static areIntersectingOrTouching(e, t) {
			return !(e.endLineNumber < t.startLineNumber || e.endLineNumber === t.startLineNumber && e.endColumn < t.startColumn) && !(t.endLineNumber < e.startLineNumber || t.endLineNumber === e.startLineNumber && t.endColumn < e.startColumn);
		}
		static areIntersecting(e, t) {
			return !(e.endLineNumber < t.startLineNumber || e.endLineNumber === t.startLineNumber && e.endColumn <= t.startColumn) && !(t.endLineNumber < e.startLineNumber || t.endLineNumber === e.startLineNumber && t.endColumn <= e.startColumn);
		}
		static areOnlyIntersecting(e, t) {
			return !(e.endLineNumber < t.startLineNumber - 1 || e.endLineNumber === t.startLineNumber && e.endColumn < t.startColumn - 1) && !(t.endLineNumber < e.startLineNumber - 1 || t.endLineNumber === e.startLineNumber && t.endColumn < e.startColumn - 1);
		}
		static compareRangesUsingStarts(e, t) {
			if (e && t) {
				const n = 0 | e.startLineNumber, r = 0 | t.startLineNumber;
				if (n === r) {
					const n = 0 | e.startColumn, r = 0 | t.startColumn;
					if (n === r) {
						const n = 0 | e.endLineNumber, r = 0 | t.endLineNumber;
						return n === r ? (0 | e.endColumn) - (0 | t.endColumn) : n - r;
					}
					return n - r;
				}
				return n - r;
			}
			return (e ? 1 : 0) - (t ? 1 : 0);
		}
		static compareRangesUsingEnds(e, t) {
			return e.endLineNumber === t.endLineNumber ? e.endColumn === t.endColumn ? e.startLineNumber === t.startLineNumber ? e.startColumn - t.startColumn : e.startLineNumber - t.startLineNumber : e.endColumn - t.endColumn : e.endLineNumber - t.endLineNumber;
		}
		static spansMultipleLines(e) {
			return e.endLineNumber > e.startLineNumber;
		}
		toJSON() {
			return this;
		}
	};
	function qe(e) {
		return e < 0 ? 0 : e > 255 ? 255 : 0 | e;
	}
	function Ke(e) {
		return e < 0 ? 0 : e > 4294967295 ? 4294967295 : 0 | e;
	}
	var Be = class e {
		constructor(t) {
			const n = qe(t);
			this._defaultValue = n, this._asciiMap = e._createAsciiMap(n), this._map = /* @__PURE__ */ new Map();
		}
		static _createAsciiMap(e) {
			const t = new Uint8Array(256);
			return t.fill(e), t;
		}
		set(e, t) {
			const n = qe(t);
			e >= 0 && e < 256 ? this._asciiMap[e] = n : this._map.set(e, n);
		}
		get(e) {
			return e >= 0 && e < 256 ? this._asciiMap[e] : this._map.get(e) || this._defaultValue;
		}
		clear() {
			this._asciiMap.fill(this._defaultValue), this._map.clear();
		}
	}, $e = class {
		constructor(e, t, n) {
			const r = new Uint8Array(e * t);
			for (let i = 0, s = e * t; i < s; i++) r[i] = n;
			this._data = r, this.rows = e, this.cols = t;
		}
		get(e, t) {
			return this._data[e * this.cols + t];
		}
		set(e, t, n) {
			this._data[e * this.cols + t] = n;
		}
	}, Ue = class {
		constructor(e) {
			let t = 0, n = 0;
			for (let i = 0, s = e.length; i < s; i++) {
				const [r, s, o] = e[i];
				s > t && (t = s), r > n && (n = r), o > n && (n = o);
			}
			t++, n++;
			const r = new $e(n, t, 0);
			for (let i = 0, s = e.length; i < s; i++) {
				const [t, n, s] = e[i];
				r.set(t, n, s);
			}
			this._states = r, this._maxCharCode = t;
		}
		nextState(e, t) {
			return t < 0 || t >= this._maxCharCode ? 0 : this._states.get(e, t);
		}
	};
	let je = null;
	let We = null;
	var ze = class e {
		static _createLink(e, t, n, r, i) {
			let s = i - 1;
			do {
				const n = t.charCodeAt(s);
				if (2 !== e.get(n)) break;
				s--;
			} while (s > r);
			if (r > 0) {
				const e = t.charCodeAt(r - 1), n = t.charCodeAt(s);
				(40 === e && 41 === n || 91 === e && 93 === n || 123 === e && 125 === n) && s--;
			}
			return {
				range: {
					startLineNumber: n,
					startColumn: r + 1,
					endLineNumber: n,
					endColumn: s + 2
				},
				url: t.substring(r, s + 1)
			};
		}
		static computeLinks(t, n = function() {
			return null === je && (je = new Ue([
				[
					1,
					104,
					2
				],
				[
					1,
					72,
					2
				],
				[
					1,
					102,
					6
				],
				[
					1,
					70,
					6
				],
				[
					2,
					116,
					3
				],
				[
					2,
					84,
					3
				],
				[
					3,
					116,
					4
				],
				[
					3,
					84,
					4
				],
				[
					4,
					112,
					5
				],
				[
					4,
					80,
					5
				],
				[
					5,
					115,
					9
				],
				[
					5,
					83,
					9
				],
				[
					5,
					58,
					10
				],
				[
					6,
					105,
					7
				],
				[
					6,
					73,
					7
				],
				[
					7,
					108,
					8
				],
				[
					7,
					76,
					8
				],
				[
					8,
					101,
					9
				],
				[
					8,
					69,
					9
				],
				[
					9,
					58,
					10
				],
				[
					10,
					47,
					11
				],
				[
					11,
					47,
					12
				]
			])), je;
		}()) {
			const r = function() {
				if (null === We) {
					We = new Be(0);
					const e = " 	<>'\"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…|";
					for (let n = 0; n < 36; n++) We.set(e.charCodeAt(n), 1);
					const t = ".,;:";
					for (let n = 0; n < 4; n++) We.set(t.charCodeAt(n), 2);
				}
				return We;
			}(), i = [];
			for (let s = 1, o = t.getLineCount(); s <= o; s++) {
				const o = t.getLineContent(s), a = o.length;
				let l = 0, u = 0, c = 0, h = 1, d = !1, f = !1, m = !1, g = !1;
				for (; l < a;) {
					let t = !1;
					const a = o.charCodeAt(l);
					if (13 === h) {
						let n;
						switch (a) {
							case 40:
								d = !0, n = 0;
								break;
							case 41:
								n = d ? 0 : 1;
								break;
							case 91:
								m = !0, f = !0, n = 0;
								break;
							case 93:
								m = !1, n = f ? 0 : 1;
								break;
							case 123:
								g = !0, n = 0;
								break;
							case 125:
								n = g ? 0 : 1;
								break;
							case 39:
							case 34:
							case 96:
								n = c === a ? 1 : 39 === c || 34 === c || 96 === c ? 0 : 1;
								break;
							case 42:
								n = 42 === c ? 1 : 0;
								break;
							case 32:
								n = m ? 0 : 1;
								break;
							default: n = r.get(a);
						}
						1 === n && (i.push(e._createLink(r, o, s, u, l)), t = !0);
					} else if (12 === h) {
						let e;
						91 === a ? (f = !0, e = 0) : e = r.get(a), 1 === e ? t = !0 : h = 13;
					} else h = n.nextState(h, a), 0 === h && (t = !0);
					t && (h = 1, d = !1, f = !1, g = !1, u = l + 1, c = a), l++;
				}
				13 === h && i.push(e._createLink(r, o, s, u, a));
			}
			return i;
		}
	};
	var He = class e {
		constructor() {
			this._defaultValueSet = [
				["true", "false"],
				["True", "False"],
				[
					"Private",
					"Public",
					"Friend",
					"ReadOnly",
					"Partial",
					"Protected",
					"WriteOnly"
				],
				[
					"public",
					"protected",
					"private"
				]
			];
		}
		static {
			this.INSTANCE = new e();
		}
		navigateValueSet(e, t, n, r, i) {
			if (e && t) {
				const n = this.doNavigateValueSet(t, i);
				if (n) return {
					range: e,
					value: n
				};
			}
			if (n && r) {
				const e = this.doNavigateValueSet(r, i);
				if (e) return {
					range: n,
					value: e
				};
			}
			return null;
		}
		doNavigateValueSet(e, t) {
			const n = this.numberReplace(e, t);
			return null !== n ? n : this.textReplace(e, t);
		}
		numberReplace(e, t) {
			const n = Math.pow(10, e.length - (e.lastIndexOf(".") + 1));
			let r = Number(e);
			const i = parseFloat(e);
			return isNaN(r) || isNaN(i) || r !== i ? null : 0 !== r || t ? (r = Math.floor(r * n), r += t ? n : -n, String(r / n)) : null;
		}
		textReplace(e, t) {
			return this.valueSetsReplace(this._defaultValueSet, e, t);
		}
		valueSetsReplace(e, t, n) {
			let r = null;
			for (let i = 0, s = e.length; null === r && i < s; i++) r = this.valueSetReplace(e[i], t, n);
			return r;
		}
		valueSetReplace(e, t, n) {
			let r = e.indexOf(t);
			return r >= 0 ? (r += n ? 1 : -1, r < 0 ? r = e.length - 1 : r %= e.length, e[r]) : null;
		}
	};
	const Ge = Object.freeze(function(e, t) {
		const n = setTimeout(e.bind(t), 0);
		return { dispose() {
			clearTimeout(n);
		} };
	});
	var Je;
	(function(e) {
		e.isCancellationToken = function(t) {
			return t === e.None || t === e.Cancelled || t instanceof Xe || !(!t || "object" != typeof t) && "boolean" == typeof t.isCancellationRequested && "function" == typeof t.onCancellationRequested;
		}, e.None = Object.freeze({
			isCancellationRequested: !1,
			onCancellationRequested: v.None
		}), e.Cancelled = Object.freeze({
			isCancellationRequested: !0,
			onCancellationRequested: Ge
		});
	})(Je || (Je = {}));
	var Xe = class {
		constructor() {
			this._isCancelled = !1, this._emitter = null;
		}
		cancel() {
			this._isCancelled || (this._isCancelled = !0, this._emitter && (this._emitter.fire(void 0), this.dispose()));
		}
		get isCancellationRequested() {
			return this._isCancelled;
		}
		get onCancellationRequested() {
			return this._isCancelled ? Ge : (this._emitter || (this._emitter = new E()), this._emitter.event);
		}
		dispose() {
			this._emitter && (this._emitter.dispose(), this._emitter = null);
		}
	}, Qe = class {
		constructor(e) {
			this._token = void 0, this._parentListener = void 0, this._parentListener = e && e.onCancellationRequested(this.cancel, this);
		}
		get token() {
			return this._token || (this._token = new Xe()), this._token;
		}
		cancel() {
			this._token ? this._token instanceof Xe && this._token.cancel() : this._token = Je.Cancelled;
		}
		dispose(e = !1) {
			e && this.cancel(), this._parentListener?.dispose(), this._token ? this._token instanceof Xe && this._token.dispose() : this._token = Je.None;
		}
	}, Ze = class {
		constructor() {
			this._keyCodeToStr = [], this._strToKeyCode = Object.create(null);
		}
		define(e, t) {
			this._keyCodeToStr[e] = t, this._strToKeyCode[t.toLowerCase()] = e;
		}
		keyCodeToStr(e) {
			return this._keyCodeToStr[e];
		}
		strToKeyCode(e) {
			return this._strToKeyCode[e.toLowerCase()] || 0;
		}
	};
	const Ye = new Ze(), et = new Ze(), tt = new Ze(), nt = new Array(230), rt = Object.create(null), it = Object.create(null), st = [];
	for (let Xl = 0; Xl <= 193; Xl++) st[Xl] = -1;
	var ot;
	let at;
	(function() {
		const e = "", t = [
			[
				1,
				0,
				"None",
				0,
				"unknown",
				0,
				"VK_UNKNOWN",
				e,
				e
			],
			[
				1,
				1,
				"Hyper",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				2,
				"Super",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				3,
				"Fn",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				4,
				"FnLock",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				5,
				"Suspend",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				6,
				"Resume",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				7,
				"Turbo",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				8,
				"Sleep",
				0,
				e,
				0,
				"VK_SLEEP",
				e,
				e
			],
			[
				1,
				9,
				"WakeUp",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				0,
				10,
				"KeyA",
				31,
				"A",
				65,
				"VK_A",
				e,
				e
			],
			[
				0,
				11,
				"KeyB",
				32,
				"B",
				66,
				"VK_B",
				e,
				e
			],
			[
				0,
				12,
				"KeyC",
				33,
				"C",
				67,
				"VK_C",
				e,
				e
			],
			[
				0,
				13,
				"KeyD",
				34,
				"D",
				68,
				"VK_D",
				e,
				e
			],
			[
				0,
				14,
				"KeyE",
				35,
				"E",
				69,
				"VK_E",
				e,
				e
			],
			[
				0,
				15,
				"KeyF",
				36,
				"F",
				70,
				"VK_F",
				e,
				e
			],
			[
				0,
				16,
				"KeyG",
				37,
				"G",
				71,
				"VK_G",
				e,
				e
			],
			[
				0,
				17,
				"KeyH",
				38,
				"H",
				72,
				"VK_H",
				e,
				e
			],
			[
				0,
				18,
				"KeyI",
				39,
				"I",
				73,
				"VK_I",
				e,
				e
			],
			[
				0,
				19,
				"KeyJ",
				40,
				"J",
				74,
				"VK_J",
				e,
				e
			],
			[
				0,
				20,
				"KeyK",
				41,
				"K",
				75,
				"VK_K",
				e,
				e
			],
			[
				0,
				21,
				"KeyL",
				42,
				"L",
				76,
				"VK_L",
				e,
				e
			],
			[
				0,
				22,
				"KeyM",
				43,
				"M",
				77,
				"VK_M",
				e,
				e
			],
			[
				0,
				23,
				"KeyN",
				44,
				"N",
				78,
				"VK_N",
				e,
				e
			],
			[
				0,
				24,
				"KeyO",
				45,
				"O",
				79,
				"VK_O",
				e,
				e
			],
			[
				0,
				25,
				"KeyP",
				46,
				"P",
				80,
				"VK_P",
				e,
				e
			],
			[
				0,
				26,
				"KeyQ",
				47,
				"Q",
				81,
				"VK_Q",
				e,
				e
			],
			[
				0,
				27,
				"KeyR",
				48,
				"R",
				82,
				"VK_R",
				e,
				e
			],
			[
				0,
				28,
				"KeyS",
				49,
				"S",
				83,
				"VK_S",
				e,
				e
			],
			[
				0,
				29,
				"KeyT",
				50,
				"T",
				84,
				"VK_T",
				e,
				e
			],
			[
				0,
				30,
				"KeyU",
				51,
				"U",
				85,
				"VK_U",
				e,
				e
			],
			[
				0,
				31,
				"KeyV",
				52,
				"V",
				86,
				"VK_V",
				e,
				e
			],
			[
				0,
				32,
				"KeyW",
				53,
				"W",
				87,
				"VK_W",
				e,
				e
			],
			[
				0,
				33,
				"KeyX",
				54,
				"X",
				88,
				"VK_X",
				e,
				e
			],
			[
				0,
				34,
				"KeyY",
				55,
				"Y",
				89,
				"VK_Y",
				e,
				e
			],
			[
				0,
				35,
				"KeyZ",
				56,
				"Z",
				90,
				"VK_Z",
				e,
				e
			],
			[
				0,
				36,
				"Digit1",
				22,
				"1",
				49,
				"VK_1",
				e,
				e
			],
			[
				0,
				37,
				"Digit2",
				23,
				"2",
				50,
				"VK_2",
				e,
				e
			],
			[
				0,
				38,
				"Digit3",
				24,
				"3",
				51,
				"VK_3",
				e,
				e
			],
			[
				0,
				39,
				"Digit4",
				25,
				"4",
				52,
				"VK_4",
				e,
				e
			],
			[
				0,
				40,
				"Digit5",
				26,
				"5",
				53,
				"VK_5",
				e,
				e
			],
			[
				0,
				41,
				"Digit6",
				27,
				"6",
				54,
				"VK_6",
				e,
				e
			],
			[
				0,
				42,
				"Digit7",
				28,
				"7",
				55,
				"VK_7",
				e,
				e
			],
			[
				0,
				43,
				"Digit8",
				29,
				"8",
				56,
				"VK_8",
				e,
				e
			],
			[
				0,
				44,
				"Digit9",
				30,
				"9",
				57,
				"VK_9",
				e,
				e
			],
			[
				0,
				45,
				"Digit0",
				21,
				"0",
				48,
				"VK_0",
				e,
				e
			],
			[
				1,
				46,
				"Enter",
				3,
				"Enter",
				13,
				"VK_RETURN",
				e,
				e
			],
			[
				1,
				47,
				"Escape",
				9,
				"Escape",
				27,
				"VK_ESCAPE",
				e,
				e
			],
			[
				1,
				48,
				"Backspace",
				1,
				"Backspace",
				8,
				"VK_BACK",
				e,
				e
			],
			[
				1,
				49,
				"Tab",
				2,
				"Tab",
				9,
				"VK_TAB",
				e,
				e
			],
			[
				1,
				50,
				"Space",
				10,
				"Space",
				32,
				"VK_SPACE",
				e,
				e
			],
			[
				0,
				51,
				"Minus",
				88,
				"-",
				189,
				"VK_OEM_MINUS",
				"-",
				"OEM_MINUS"
			],
			[
				0,
				52,
				"Equal",
				86,
				"=",
				187,
				"VK_OEM_PLUS",
				"=",
				"OEM_PLUS"
			],
			[
				0,
				53,
				"BracketLeft",
				92,
				"[",
				219,
				"VK_OEM_4",
				"[",
				"OEM_4"
			],
			[
				0,
				54,
				"BracketRight",
				94,
				"]",
				221,
				"VK_OEM_6",
				"]",
				"OEM_6"
			],
			[
				0,
				55,
				"Backslash",
				93,
				"\\",
				220,
				"VK_OEM_5",
				"\\",
				"OEM_5"
			],
			[
				0,
				56,
				"IntlHash",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				0,
				57,
				"Semicolon",
				85,
				";",
				186,
				"VK_OEM_1",
				";",
				"OEM_1"
			],
			[
				0,
				58,
				"Quote",
				95,
				"'",
				222,
				"VK_OEM_7",
				"'",
				"OEM_7"
			],
			[
				0,
				59,
				"Backquote",
				91,
				"`",
				192,
				"VK_OEM_3",
				"`",
				"OEM_3"
			],
			[
				0,
				60,
				"Comma",
				87,
				",",
				188,
				"VK_OEM_COMMA",
				",",
				"OEM_COMMA"
			],
			[
				0,
				61,
				"Period",
				89,
				".",
				190,
				"VK_OEM_PERIOD",
				".",
				"OEM_PERIOD"
			],
			[
				0,
				62,
				"Slash",
				90,
				"/",
				191,
				"VK_OEM_2",
				"/",
				"OEM_2"
			],
			[
				1,
				63,
				"CapsLock",
				8,
				"CapsLock",
				20,
				"VK_CAPITAL",
				e,
				e
			],
			[
				1,
				64,
				"F1",
				59,
				"F1",
				112,
				"VK_F1",
				e,
				e
			],
			[
				1,
				65,
				"F2",
				60,
				"F2",
				113,
				"VK_F2",
				e,
				e
			],
			[
				1,
				66,
				"F3",
				61,
				"F3",
				114,
				"VK_F3",
				e,
				e
			],
			[
				1,
				67,
				"F4",
				62,
				"F4",
				115,
				"VK_F4",
				e,
				e
			],
			[
				1,
				68,
				"F5",
				63,
				"F5",
				116,
				"VK_F5",
				e,
				e
			],
			[
				1,
				69,
				"F6",
				64,
				"F6",
				117,
				"VK_F6",
				e,
				e
			],
			[
				1,
				70,
				"F7",
				65,
				"F7",
				118,
				"VK_F7",
				e,
				e
			],
			[
				1,
				71,
				"F8",
				66,
				"F8",
				119,
				"VK_F8",
				e,
				e
			],
			[
				1,
				72,
				"F9",
				67,
				"F9",
				120,
				"VK_F9",
				e,
				e
			],
			[
				1,
				73,
				"F10",
				68,
				"F10",
				121,
				"VK_F10",
				e,
				e
			],
			[
				1,
				74,
				"F11",
				69,
				"F11",
				122,
				"VK_F11",
				e,
				e
			],
			[
				1,
				75,
				"F12",
				70,
				"F12",
				123,
				"VK_F12",
				e,
				e
			],
			[
				1,
				76,
				"PrintScreen",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				77,
				"ScrollLock",
				84,
				"ScrollLock",
				145,
				"VK_SCROLL",
				e,
				e
			],
			[
				1,
				78,
				"Pause",
				7,
				"PauseBreak",
				19,
				"VK_PAUSE",
				e,
				e
			],
			[
				1,
				79,
				"Insert",
				19,
				"Insert",
				45,
				"VK_INSERT",
				e,
				e
			],
			[
				1,
				80,
				"Home",
				14,
				"Home",
				36,
				"VK_HOME",
				e,
				e
			],
			[
				1,
				81,
				"PageUp",
				11,
				"PageUp",
				33,
				"VK_PRIOR",
				e,
				e
			],
			[
				1,
				82,
				"Delete",
				20,
				"Delete",
				46,
				"VK_DELETE",
				e,
				e
			],
			[
				1,
				83,
				"End",
				13,
				"End",
				35,
				"VK_END",
				e,
				e
			],
			[
				1,
				84,
				"PageDown",
				12,
				"PageDown",
				34,
				"VK_NEXT",
				e,
				e
			],
			[
				1,
				85,
				"ArrowRight",
				17,
				"RightArrow",
				39,
				"VK_RIGHT",
				"Right",
				e
			],
			[
				1,
				86,
				"ArrowLeft",
				15,
				"LeftArrow",
				37,
				"VK_LEFT",
				"Left",
				e
			],
			[
				1,
				87,
				"ArrowDown",
				18,
				"DownArrow",
				40,
				"VK_DOWN",
				"Down",
				e
			],
			[
				1,
				88,
				"ArrowUp",
				16,
				"UpArrow",
				38,
				"VK_UP",
				"Up",
				e
			],
			[
				1,
				89,
				"NumLock",
				83,
				"NumLock",
				144,
				"VK_NUMLOCK",
				e,
				e
			],
			[
				1,
				90,
				"NumpadDivide",
				113,
				"NumPad_Divide",
				111,
				"VK_DIVIDE",
				e,
				e
			],
			[
				1,
				91,
				"NumpadMultiply",
				108,
				"NumPad_Multiply",
				106,
				"VK_MULTIPLY",
				e,
				e
			],
			[
				1,
				92,
				"NumpadSubtract",
				111,
				"NumPad_Subtract",
				109,
				"VK_SUBTRACT",
				e,
				e
			],
			[
				1,
				93,
				"NumpadAdd",
				109,
				"NumPad_Add",
				107,
				"VK_ADD",
				e,
				e
			],
			[
				1,
				94,
				"NumpadEnter",
				3,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				95,
				"Numpad1",
				99,
				"NumPad1",
				97,
				"VK_NUMPAD1",
				e,
				e
			],
			[
				1,
				96,
				"Numpad2",
				100,
				"NumPad2",
				98,
				"VK_NUMPAD2",
				e,
				e
			],
			[
				1,
				97,
				"Numpad3",
				101,
				"NumPad3",
				99,
				"VK_NUMPAD3",
				e,
				e
			],
			[
				1,
				98,
				"Numpad4",
				102,
				"NumPad4",
				100,
				"VK_NUMPAD4",
				e,
				e
			],
			[
				1,
				99,
				"Numpad5",
				103,
				"NumPad5",
				101,
				"VK_NUMPAD5",
				e,
				e
			],
			[
				1,
				100,
				"Numpad6",
				104,
				"NumPad6",
				102,
				"VK_NUMPAD6",
				e,
				e
			],
			[
				1,
				101,
				"Numpad7",
				105,
				"NumPad7",
				103,
				"VK_NUMPAD7",
				e,
				e
			],
			[
				1,
				102,
				"Numpad8",
				106,
				"NumPad8",
				104,
				"VK_NUMPAD8",
				e,
				e
			],
			[
				1,
				103,
				"Numpad9",
				107,
				"NumPad9",
				105,
				"VK_NUMPAD9",
				e,
				e
			],
			[
				1,
				104,
				"Numpad0",
				98,
				"NumPad0",
				96,
				"VK_NUMPAD0",
				e,
				e
			],
			[
				1,
				105,
				"NumpadDecimal",
				112,
				"NumPad_Decimal",
				110,
				"VK_DECIMAL",
				e,
				e
			],
			[
				0,
				106,
				"IntlBackslash",
				97,
				"OEM_102",
				226,
				"VK_OEM_102",
				e,
				e
			],
			[
				1,
				107,
				"ContextMenu",
				58,
				"ContextMenu",
				93,
				e,
				e,
				e
			],
			[
				1,
				108,
				"Power",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				109,
				"NumpadEqual",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				110,
				"F13",
				71,
				"F13",
				124,
				"VK_F13",
				e,
				e
			],
			[
				1,
				111,
				"F14",
				72,
				"F14",
				125,
				"VK_F14",
				e,
				e
			],
			[
				1,
				112,
				"F15",
				73,
				"F15",
				126,
				"VK_F15",
				e,
				e
			],
			[
				1,
				113,
				"F16",
				74,
				"F16",
				127,
				"VK_F16",
				e,
				e
			],
			[
				1,
				114,
				"F17",
				75,
				"F17",
				128,
				"VK_F17",
				e,
				e
			],
			[
				1,
				115,
				"F18",
				76,
				"F18",
				129,
				"VK_F18",
				e,
				e
			],
			[
				1,
				116,
				"F19",
				77,
				"F19",
				130,
				"VK_F19",
				e,
				e
			],
			[
				1,
				117,
				"F20",
				78,
				"F20",
				131,
				"VK_F20",
				e,
				e
			],
			[
				1,
				118,
				"F21",
				79,
				"F21",
				132,
				"VK_F21",
				e,
				e
			],
			[
				1,
				119,
				"F22",
				80,
				"F22",
				133,
				"VK_F22",
				e,
				e
			],
			[
				1,
				120,
				"F23",
				81,
				"F23",
				134,
				"VK_F23",
				e,
				e
			],
			[
				1,
				121,
				"F24",
				82,
				"F24",
				135,
				"VK_F24",
				e,
				e
			],
			[
				1,
				122,
				"Open",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				123,
				"Help",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				124,
				"Select",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				125,
				"Again",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				126,
				"Undo",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				127,
				"Cut",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				128,
				"Copy",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				129,
				"Paste",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				130,
				"Find",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				131,
				"AudioVolumeMute",
				117,
				"AudioVolumeMute",
				173,
				"VK_VOLUME_MUTE",
				e,
				e
			],
			[
				1,
				132,
				"AudioVolumeUp",
				118,
				"AudioVolumeUp",
				175,
				"VK_VOLUME_UP",
				e,
				e
			],
			[
				1,
				133,
				"AudioVolumeDown",
				119,
				"AudioVolumeDown",
				174,
				"VK_VOLUME_DOWN",
				e,
				e
			],
			[
				1,
				134,
				"NumpadComma",
				110,
				"NumPad_Separator",
				108,
				"VK_SEPARATOR",
				e,
				e
			],
			[
				0,
				135,
				"IntlRo",
				115,
				"ABNT_C1",
				193,
				"VK_ABNT_C1",
				e,
				e
			],
			[
				1,
				136,
				"KanaMode",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				0,
				137,
				"IntlYen",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				138,
				"Convert",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				139,
				"NonConvert",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				140,
				"Lang1",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				141,
				"Lang2",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				142,
				"Lang3",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				143,
				"Lang4",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				144,
				"Lang5",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				145,
				"Abort",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				146,
				"Props",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				147,
				"NumpadParenLeft",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				148,
				"NumpadParenRight",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				149,
				"NumpadBackspace",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				150,
				"NumpadMemoryStore",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				151,
				"NumpadMemoryRecall",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				152,
				"NumpadMemoryClear",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				153,
				"NumpadMemoryAdd",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				154,
				"NumpadMemorySubtract",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				155,
				"NumpadClear",
				131,
				"Clear",
				12,
				"VK_CLEAR",
				e,
				e
			],
			[
				1,
				156,
				"NumpadClearEntry",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				0,
				e,
				5,
				"Ctrl",
				17,
				"VK_CONTROL",
				e,
				e
			],
			[
				1,
				0,
				e,
				4,
				"Shift",
				16,
				"VK_SHIFT",
				e,
				e
			],
			[
				1,
				0,
				e,
				6,
				"Alt",
				18,
				"VK_MENU",
				e,
				e
			],
			[
				1,
				0,
				e,
				57,
				"Meta",
				91,
				"VK_COMMAND",
				e,
				e
			],
			[
				1,
				157,
				"ControlLeft",
				5,
				e,
				0,
				"VK_LCONTROL",
				e,
				e
			],
			[
				1,
				158,
				"ShiftLeft",
				4,
				e,
				0,
				"VK_LSHIFT",
				e,
				e
			],
			[
				1,
				159,
				"AltLeft",
				6,
				e,
				0,
				"VK_LMENU",
				e,
				e
			],
			[
				1,
				160,
				"MetaLeft",
				57,
				e,
				0,
				"VK_LWIN",
				e,
				e
			],
			[
				1,
				161,
				"ControlRight",
				5,
				e,
				0,
				"VK_RCONTROL",
				e,
				e
			],
			[
				1,
				162,
				"ShiftRight",
				4,
				e,
				0,
				"VK_RSHIFT",
				e,
				e
			],
			[
				1,
				163,
				"AltRight",
				6,
				e,
				0,
				"VK_RMENU",
				e,
				e
			],
			[
				1,
				164,
				"MetaRight",
				57,
				e,
				0,
				"VK_RWIN",
				e,
				e
			],
			[
				1,
				165,
				"BrightnessUp",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				166,
				"BrightnessDown",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				167,
				"MediaPlay",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				168,
				"MediaRecord",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				169,
				"MediaFastForward",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				170,
				"MediaRewind",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				171,
				"MediaTrackNext",
				124,
				"MediaTrackNext",
				176,
				"VK_MEDIA_NEXT_TRACK",
				e,
				e
			],
			[
				1,
				172,
				"MediaTrackPrevious",
				125,
				"MediaTrackPrevious",
				177,
				"VK_MEDIA_PREV_TRACK",
				e,
				e
			],
			[
				1,
				173,
				"MediaStop",
				126,
				"MediaStop",
				178,
				"VK_MEDIA_STOP",
				e,
				e
			],
			[
				1,
				174,
				"Eject",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				175,
				"MediaPlayPause",
				127,
				"MediaPlayPause",
				179,
				"VK_MEDIA_PLAY_PAUSE",
				e,
				e
			],
			[
				1,
				176,
				"MediaSelect",
				128,
				"LaunchMediaPlayer",
				181,
				"VK_MEDIA_LAUNCH_MEDIA_SELECT",
				e,
				e
			],
			[
				1,
				177,
				"LaunchMail",
				129,
				"LaunchMail",
				180,
				"VK_MEDIA_LAUNCH_MAIL",
				e,
				e
			],
			[
				1,
				178,
				"LaunchApp2",
				130,
				"LaunchApp2",
				183,
				"VK_MEDIA_LAUNCH_APP2",
				e,
				e
			],
			[
				1,
				179,
				"LaunchApp1",
				0,
				e,
				0,
				"VK_MEDIA_LAUNCH_APP1",
				e,
				e
			],
			[
				1,
				180,
				"SelectTask",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				181,
				"LaunchScreenSaver",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				182,
				"BrowserSearch",
				120,
				"BrowserSearch",
				170,
				"VK_BROWSER_SEARCH",
				e,
				e
			],
			[
				1,
				183,
				"BrowserHome",
				121,
				"BrowserHome",
				172,
				"VK_BROWSER_HOME",
				e,
				e
			],
			[
				1,
				184,
				"BrowserBack",
				122,
				"BrowserBack",
				166,
				"VK_BROWSER_BACK",
				e,
				e
			],
			[
				1,
				185,
				"BrowserForward",
				123,
				"BrowserForward",
				167,
				"VK_BROWSER_FORWARD",
				e,
				e
			],
			[
				1,
				186,
				"BrowserStop",
				0,
				e,
				0,
				"VK_BROWSER_STOP",
				e,
				e
			],
			[
				1,
				187,
				"BrowserRefresh",
				0,
				e,
				0,
				"VK_BROWSER_REFRESH",
				e,
				e
			],
			[
				1,
				188,
				"BrowserFavorites",
				0,
				e,
				0,
				"VK_BROWSER_FAVORITES",
				e,
				e
			],
			[
				1,
				189,
				"ZoomToggle",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				190,
				"MailReply",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				191,
				"MailForward",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				192,
				"MailSend",
				0,
				e,
				0,
				e,
				e,
				e
			],
			[
				1,
				0,
				e,
				114,
				"KeyInComposition",
				229,
				e,
				e,
				e
			],
			[
				1,
				0,
				e,
				116,
				"ABNT_C2",
				194,
				"VK_ABNT_C2",
				e,
				e
			],
			[
				1,
				0,
				e,
				96,
				"OEM_8",
				223,
				"VK_OEM_8",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_KANA",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_HANGUL",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_JUNJA",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_FINAL",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_HANJA",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_KANJI",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_CONVERT",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_NONCONVERT",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_ACCEPT",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_MODECHANGE",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_SELECT",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_PRINT",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_EXECUTE",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_SNAPSHOT",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_HELP",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_APPS",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_PROCESSKEY",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_PACKET",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_DBE_SBCSCHAR",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_DBE_DBCSCHAR",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_ATTN",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_CRSEL",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_EXSEL",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_EREOF",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_PLAY",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_ZOOM",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_NONAME",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_PA1",
				e,
				e
			],
			[
				1,
				0,
				e,
				0,
				e,
				0,
				"VK_OEM_CLEAR",
				e,
				e
			]
		], n = [], r = [];
		for (const i of t) {
			const [e, t, s, o, a, l, u, c, h] = i;
			if (r[t] || (r[t] = !0, rt[s] = t, it[s.toLowerCase()] = t, e && (st[t] = o)), !n[o]) {
				if (n[o] = !0, !a) throw new Error(`String representation missing for key code ${o} around scan code ${s}`);
				Ye.define(o, a), et.define(o, c || a), tt.define(o, h || c || a);
			}
			l && (nt[l] = o);
		}
	})(), function(e) {
		e.toString = function(e) {
			return Ye.keyCodeToStr(e);
		}, e.fromString = function(e) {
			return Ye.strToKeyCode(e);
		}, e.toUserSettingsUS = function(e) {
			return et.keyCodeToStr(e);
		}, e.toUserSettingsGeneral = function(e) {
			return tt.keyCodeToStr(e);
		}, e.fromUserSettings = function(e) {
			return et.strToKeyCode(e) || tt.strToKeyCode(e);
		}, e.toElectronAccelerator = function(e) {
			if (e >= 98 && e <= 113) return null;
			switch (e) {
				case 16: return "Up";
				case 18: return "Down";
				case 15: return "Left";
				case 17: return "Right";
			}
			return Ye.keyCodeToStr(e);
		};
	}(ot || (ot = {}));
	const lt = globalThis.vscode;
	if (void 0 !== lt && void 0 !== lt.process) {
		const e = lt.process;
		at = {
			get platform() {
				return e.platform;
			},
			get arch() {
				return e.arch;
			},
			get env() {
				return e.env;
			},
			cwd: () => e.cwd()
		};
	} else at = "undefined" != typeof process && "string" == typeof process?.versions?.node ? {
		get platform() {
			return process.platform;
		},
		get arch() {
			return process.arch;
		},
		get env() {
			return {};
		},
		cwd: () => ({}).VSCODE_CWD || process.cwd()
	} : {
		get platform() {
			return z ? "win32" : H ? "darwin" : "linux";
		},
		get arch() {},
		get env() {
			return {};
		},
		cwd: () => "/"
	};
	const ut = at.cwd, ct = at.env, ht = at.platform, dt = 46, ft = 47, mt = 92, gt = 58;
	var pt = class extends Error {
		constructor(e, t, n) {
			let r;
			"string" == typeof t && 0 === t.indexOf("not ") ? (r = "must not be", t = t.replace(/^not /, "")) : r = "must be";
			let i = `The "${e}" ${-1 !== e.indexOf(".") ? "property" : "argument"} ${r} of type ${t}`;
			i += ". Received type " + typeof n, super(i), this.code = "ERR_INVALID_ARG_TYPE";
		}
	};
	function bt(e, t) {
		if ("string" != typeof e) throw new pt(t, "string", e);
	}
	const yt = "win32" === ht;
	function vt(e) {
		return e === ft || e === mt;
	}
	function wt(e) {
		return e === ft;
	}
	function _t(e) {
		return e >= 65 && e <= 90 || e >= 97 && e <= 122;
	}
	function Ct(e, t, n, r) {
		let i = "", s = 0, o = -1, a = 0, l = 0;
		for (let u = 0; u <= e.length; ++u) {
			if (u < e.length) l = e.charCodeAt(u);
			else {
				if (r(l)) break;
				l = ft;
			}
			if (r(l)) {
				if (o === u - 1 || 1 === a);
				else if (2 === a) {
					if (i.length < 2 || 2 !== s || i.charCodeAt(i.length - 1) !== dt || i.charCodeAt(i.length - 2) !== dt) {
						if (i.length > 2) {
							const e = i.lastIndexOf(n);
							-1 === e ? (i = "", s = 0) : (i = i.slice(0, e), s = i.length - 1 - i.lastIndexOf(n)), o = u, a = 0;
							continue;
						}
						if (0 !== i.length) {
							i = "", s = 0, o = u, a = 0;
							continue;
						}
					}
					t && (i += i.length > 0 ? `${n}..` : "..", s = 2);
				} else i.length > 0 ? i += `${n}${e.slice(o + 1, u)}` : i = e.slice(o + 1, u), s = u - o - 1;
				o = u, a = 0;
			} else l === dt && -1 !== a ? ++a : a = -1;
		}
		return i;
	}
	function St(e, t) {
		(function(e, t) {
			if (null === e || "object" != typeof e) throw new pt(t, "Object", e);
		})(t, "pathObject");
		const n = t.dir || t.root, r = t.base || `${t.name || ""}${i = t.ext, i ? `${"." === i[0] ? "" : "."}${i}` : ""}`;
		var i;
		return n ? n === t.root ? `${n}${r}` : `${n}${e}${r}` : r;
	}
	const Lt = {
		resolve(...e) {
			let t = "", n = "", r = !1;
			for (let i = e.length - 1; i >= -1; i--) {
				let s;
				if (i >= 0) {
					if (s = e[i], bt(s, `paths[${i}]`), 0 === s.length) continue;
				} else 0 === t.length ? s = ut() : (s = ct[`=${t}`] || ut(), (void 0 === s || s.slice(0, 2).toLowerCase() !== t.toLowerCase() && s.charCodeAt(2) === mt) && (s = `${t}\\`));
				const o = s.length;
				let a = 0, l = "", u = !1;
				const c = s.charCodeAt(0);
				if (1 === o) vt(c) && (a = 1, u = !0);
				else if (vt(c)) if (u = !0, vt(s.charCodeAt(1))) {
					let e = 2, t = e;
					for (; e < o && !vt(s.charCodeAt(e));) e++;
					if (e < o && e !== t) {
						const n = s.slice(t, e);
						for (t = e; e < o && vt(s.charCodeAt(e));) e++;
						if (e < o && e !== t) {
							for (t = e; e < o && !vt(s.charCodeAt(e));) e++;
							e !== o && e === t || (l = `\\\\${n}\\${s.slice(t, e)}`, a = e);
						}
					}
				} else a = 1;
				else _t(c) && s.charCodeAt(1) === gt && (l = s.slice(0, 2), a = 2, o > 2 && vt(s.charCodeAt(2)) && (u = !0, a = 3));
				if (l.length > 0) if (t.length > 0) {
					if (l.toLowerCase() !== t.toLowerCase()) continue;
				} else t = l;
				if (r) {
					if (t.length > 0) break;
				} else if (n = `${s.slice(a)}\\${n}`, r = u, u && t.length > 0) break;
			}
			return n = Ct(n, !r, "\\", vt), r ? `${t}\\${n}` : `${t}${n}` || ".";
		},
		normalize(e) {
			bt(e, "path");
			const t = e.length;
			if (0 === t) return ".";
			let n, r = 0, i = !1;
			const s = e.charCodeAt(0);
			if (1 === t) return wt(s) ? "\\" : e;
			if (vt(s)) if (i = !0, vt(e.charCodeAt(1))) {
				let i = 2, s = i;
				for (; i < t && !vt(e.charCodeAt(i));) i++;
				if (i < t && i !== s) {
					const o = e.slice(s, i);
					for (s = i; i < t && vt(e.charCodeAt(i));) i++;
					if (i < t && i !== s) {
						for (s = i; i < t && !vt(e.charCodeAt(i));) i++;
						if (i === t) return `\\\\${o}\\${e.slice(s)}\\`;
						i !== s && (n = `\\\\${o}\\${e.slice(s, i)}`, r = i);
					}
				}
			} else r = 1;
			else _t(s) && e.charCodeAt(1) === gt && (n = e.slice(0, 2), r = 2, t > 2 && vt(e.charCodeAt(2)) && (i = !0, r = 3));
			let o = r < t ? Ct(e.slice(r), !i, "\\", vt) : "";
			if (0 !== o.length || i || (o = "."), o.length > 0 && vt(e.charCodeAt(t - 1)) && (o += "\\"), !i && void 0 === n && e.includes(":")) {
				if (o.length >= 2 && _t(o.charCodeAt(0)) && o.charCodeAt(1) === gt) return `.\\${o}`;
				let n = e.indexOf(":");
				do
					if (n === t - 1 || vt(e.charCodeAt(n + 1))) return `.\\${o}`;
				while (-1 !== (n = e.indexOf(":", n + 1)));
			}
			return void 0 === n ? i ? `\\${o}` : o : i ? `${n}\\${o}` : `${n}${o}`;
		},
		isAbsolute(e) {
			bt(e, "path");
			const t = e.length;
			if (0 === t) return !1;
			const n = e.charCodeAt(0);
			return vt(n) || t > 2 && _t(n) && e.charCodeAt(1) === gt && vt(e.charCodeAt(2));
		},
		join(...e) {
			if (0 === e.length) return ".";
			let t, n;
			for (let s = 0; s < e.length; ++s) {
				const r = e[s];
				bt(r, "path"), r.length > 0 && (void 0 === t ? t = n = r : t += `\\${r}`);
			}
			if (void 0 === t) return ".";
			let r = !0, i = 0;
			if ("string" == typeof n && vt(n.charCodeAt(0))) {
				++i;
				const e = n.length;
				e > 1 && vt(n.charCodeAt(1)) && (++i, e > 2 && (vt(n.charCodeAt(2)) ? ++i : r = !1));
			}
			if (r) {
				for (; i < t.length && vt(t.charCodeAt(i));) i++;
				i >= 2 && (t = `\\${t.slice(i)}`);
			}
			return Lt.normalize(t);
		},
		relative(e, t) {
			if (bt(e, "from"), bt(t, "to"), e === t) return "";
			const n = Lt.resolve(e), r = Lt.resolve(t);
			if (n === r) return "";
			if ((e = n.toLowerCase()) === (t = r.toLowerCase())) return "";
			if (n.length !== e.length || r.length !== t.length) {
				const e = n.split("\\"), t = r.split("\\");
				"" === e[e.length - 1] && e.pop(), "" === t[t.length - 1] && t.pop();
				const i = e.length, s = t.length, o = i < s ? i : s;
				let a;
				for (a = 0; a < o && e[a].toLowerCase() === t[a].toLowerCase(); a++);
				return 0 === a ? r : a === o ? s > o ? t.slice(a).join("\\") : i > o ? "..\\".repeat(i - 1 - a) + ".." : "" : "..\\".repeat(i - a) + t.slice(a).join("\\");
			}
			let i = 0;
			for (; i < e.length && e.charCodeAt(i) === mt;) i++;
			let s = e.length;
			for (; s - 1 > i && e.charCodeAt(s - 1) === mt;) s--;
			const o = s - i;
			let a = 0;
			for (; a < t.length && t.charCodeAt(a) === mt;) a++;
			let l = t.length;
			for (; l - 1 > a && t.charCodeAt(l - 1) === mt;) l--;
			const u = l - a, c = o < u ? o : u;
			let h = -1, d = 0;
			for (; d < c; d++) {
				const n = e.charCodeAt(i + d);
				if (n !== t.charCodeAt(a + d)) break;
				n === mt && (h = d);
			}
			if (d !== c) {
				if (-1 === h) return r;
			} else {
				if (u > c) {
					if (t.charCodeAt(a + d) === mt) return r.slice(a + d + 1);
					if (2 === d) return r.slice(a + d);
				}
				o > c && (e.charCodeAt(i + d) === mt ? h = d : 2 === d && (h = 3)), -1 === h && (h = 0);
			}
			let f = "";
			for (d = i + h + 1; d <= s; ++d) d !== s && e.charCodeAt(d) !== mt || (f += 0 === f.length ? ".." : "\\..");
			return a += h, f.length > 0 ? `${f}${r.slice(a, l)}` : (r.charCodeAt(a) === mt && ++a, r.slice(a, l));
		},
		toNamespacedPath(e) {
			if ("string" != typeof e || 0 === e.length) return e;
			const t = Lt.resolve(e);
			if (t.length <= 2) return e;
			if (t.charCodeAt(0) === mt) {
				if (t.charCodeAt(1) === mt) {
					const e = t.charCodeAt(2);
					if (63 !== e && e !== dt) return `\\\\?\\UNC\\${t.slice(2)}`;
				}
			} else if (_t(t.charCodeAt(0)) && t.charCodeAt(1) === gt && t.charCodeAt(2) === mt) return `\\\\?\\${t}`;
			return t;
		},
		dirname(e) {
			bt(e, "path");
			const t = e.length;
			if (0 === t) return ".";
			let n = -1, r = 0;
			const i = e.charCodeAt(0);
			if (1 === t) return vt(i) ? e : ".";
			if (vt(i)) {
				if (n = r = 1, vt(e.charCodeAt(1))) {
					let i = 2, s = i;
					for (; i < t && !vt(e.charCodeAt(i));) i++;
					if (i < t && i !== s) {
						for (s = i; i < t && vt(e.charCodeAt(i));) i++;
						if (i < t && i !== s) {
							for (s = i; i < t && !vt(e.charCodeAt(i));) i++;
							if (i === t) return e;
							i !== s && (n = r = i + 1);
						}
					}
				}
			} else _t(i) && e.charCodeAt(1) === gt && (n = t > 2 && vt(e.charCodeAt(2)) ? 3 : 2, r = n);
			let s = -1, o = !0;
			for (let a = t - 1; a >= r; --a) if (vt(e.charCodeAt(a))) {
				if (!o) {
					s = a;
					break;
				}
			} else o = !1;
			if (-1 === s) {
				if (-1 === n) return ".";
				s = n;
			}
			return e.slice(0, s);
		},
		basename(e, t) {
			void 0 !== t && bt(t, "suffix"), bt(e, "path");
			let n, r = 0, i = -1, s = !0;
			if (e.length >= 2 && _t(e.charCodeAt(0)) && e.charCodeAt(1) === gt && (r = 2), void 0 !== t && t.length > 0 && t.length <= e.length) {
				if (t === e) return "";
				let o = t.length - 1, a = -1;
				for (n = e.length - 1; n >= r; --n) {
					const l = e.charCodeAt(n);
					if (vt(l)) {
						if (!s) {
							r = n + 1;
							break;
						}
					} else -1 === a && (s = !1, a = n + 1), o >= 0 && (l === t.charCodeAt(o) ? -1 === --o && (i = n) : (o = -1, i = a));
				}
				return r === i ? i = a : -1 === i && (i = e.length), e.slice(r, i);
			}
			for (n = e.length - 1; n >= r; --n) if (vt(e.charCodeAt(n))) {
				if (!s) {
					r = n + 1;
					break;
				}
			} else -1 === i && (s = !1, i = n + 1);
			return -1 === i ? "" : e.slice(r, i);
		},
		extname(e) {
			bt(e, "path");
			let t = 0, n = -1, r = 0, i = -1, s = !0, o = 0;
			e.length >= 2 && e.charCodeAt(1) === gt && _t(e.charCodeAt(0)) && (t = r = 2);
			for (let a = e.length - 1; a >= t; --a) {
				const t = e.charCodeAt(a);
				if (vt(t)) {
					if (!s) {
						r = a + 1;
						break;
					}
				} else -1 === i && (s = !1, i = a + 1), t === dt ? -1 === n ? n = a : 1 !== o && (o = 1) : -1 !== n && (o = -1);
			}
			return -1 === n || -1 === i || 0 === o || 1 === o && n === i - 1 && n === r + 1 ? "" : e.slice(n, i);
		},
		format: St.bind(null, "\\"),
		parse(e) {
			bt(e, "path");
			const t = {
				root: "",
				dir: "",
				base: "",
				ext: "",
				name: ""
			};
			if (0 === e.length) return t;
			const n = e.length;
			let r = 0, i = e.charCodeAt(0);
			if (1 === n) return vt(i) ? (t.root = t.dir = e, t) : (t.base = t.name = e, t);
			if (vt(i)) {
				if (r = 1, vt(e.charCodeAt(1))) {
					let t = 2, i = t;
					for (; t < n && !vt(e.charCodeAt(t));) t++;
					if (t < n && t !== i) {
						for (i = t; t < n && vt(e.charCodeAt(t));) t++;
						if (t < n && t !== i) {
							for (i = t; t < n && !vt(e.charCodeAt(t));) t++;
							t === n ? r = t : t !== i && (r = t + 1);
						}
					}
				}
			} else if (_t(i) && e.charCodeAt(1) === gt) {
				if (n <= 2) return t.root = t.dir = e, t;
				if (r = 2, vt(e.charCodeAt(2))) {
					if (3 === n) return t.root = t.dir = e, t;
					r = 3;
				}
			}
			r > 0 && (t.root = e.slice(0, r));
			let s = -1, o = r, a = -1, l = !0, u = e.length - 1, c = 0;
			for (; u >= r; --u) if (i = e.charCodeAt(u), vt(i)) {
				if (!l) {
					o = u + 1;
					break;
				}
			} else -1 === a && (l = !1, a = u + 1), i === dt ? -1 === s ? s = u : 1 !== c && (c = 1) : -1 !== s && (c = -1);
			return -1 !== a && (-1 === s || 0 === c || 1 === c && s === a - 1 && s === o + 1 ? t.base = t.name = e.slice(o, a) : (t.name = e.slice(o, s), t.base = e.slice(o, a), t.ext = e.slice(s, a))), t.dir = o > 0 && o !== r ? e.slice(0, o - 1) : t.root, t;
		},
		sep: "\\",
		delimiter: ";",
		win32: null,
		posix: null
	}, Nt = (() => {
		if (yt) {
			const e = /\\/g;
			return () => {
				const t = ut().replace(e, "/");
				return t.slice(t.indexOf("/"));
			};
		}
		return () => ut();
	})(), xt = {
		resolve(...e) {
			let t = "", n = !1;
			for (let r = e.length - 1; r >= 0 && !n; r--) {
				const i = e[r];
				bt(i, `paths[${r}]`), 0 !== i.length && (t = `${i}/${t}`, n = i.charCodeAt(0) === ft);
			}
			if (!n) {
				const e = Nt();
				t = `${e}/${t}`, n = e.charCodeAt(0) === ft;
			}
			return t = Ct(t, !n, "/", wt), n ? `/${t}` : t.length > 0 ? t : ".";
		},
		normalize(e) {
			if (bt(e, "path"), 0 === e.length) return ".";
			const t = e.charCodeAt(0) === ft, n = e.charCodeAt(e.length - 1) === ft;
			return 0 === (e = Ct(e, !t, "/", wt)).length ? t ? "/" : n ? "./" : "." : (n && (e += "/"), t ? `/${e}` : e);
		},
		isAbsolute: (e) => (bt(e, "path"), e.length > 0 && e.charCodeAt(0) === ft),
		join(...e) {
			if (0 === e.length) return ".";
			const t = [];
			for (let n = 0; n < e.length; ++n) {
				const r = e[n];
				bt(r, "path"), r.length > 0 && t.push(r);
			}
			return 0 === t.length ? "." : xt.normalize(t.join("/"));
		},
		relative(e, t) {
			if (bt(e, "from"), bt(t, "to"), e === t) return "";
			if ((e = xt.resolve(e)) === (t = xt.resolve(t))) return "";
			const n = e.length, r = n - 1, i = t.length - 1, s = r < i ? r : i;
			let o = -1, a = 0;
			for (; a < s; a++) {
				const n = e.charCodeAt(1 + a);
				if (n !== t.charCodeAt(1 + a)) break;
				n === ft && (o = a);
			}
			if (a === s) if (i > s) {
				if (t.charCodeAt(1 + a) === ft) return t.slice(1 + a + 1);
				if (0 === a) return t.slice(1 + a);
			} else r > s && (e.charCodeAt(1 + a) === ft ? o = a : 0 === a && (o = 0));
			let l = "";
			for (a = 1 + o + 1; a <= n; ++a) a !== n && e.charCodeAt(a) !== ft || (l += 0 === l.length ? ".." : "/..");
			return `${l}${t.slice(1 + o)}`;
		},
		toNamespacedPath: (e) => e,
		dirname(e) {
			if (bt(e, "path"), 0 === e.length) return ".";
			const t = e.charCodeAt(0) === ft;
			let n = -1, r = !0;
			for (let i = e.length - 1; i >= 1; --i) if (e.charCodeAt(i) === ft) {
				if (!r) {
					n = i;
					break;
				}
			} else r = !1;
			return -1 === n ? t ? "/" : "." : t && 1 === n ? "//" : e.slice(0, n);
		},
		basename(e, t) {
			void 0 !== t && bt(t, "suffix"), bt(e, "path");
			let n, r = 0, i = -1, s = !0;
			if (void 0 !== t && t.length > 0 && t.length <= e.length) {
				if (t === e) return "";
				let o = t.length - 1, a = -1;
				for (n = e.length - 1; n >= 0; --n) {
					const l = e.charCodeAt(n);
					if (l === ft) {
						if (!s) {
							r = n + 1;
							break;
						}
					} else -1 === a && (s = !1, a = n + 1), o >= 0 && (l === t.charCodeAt(o) ? -1 === --o && (i = n) : (o = -1, i = a));
				}
				return r === i ? i = a : -1 === i && (i = e.length), e.slice(r, i);
			}
			for (n = e.length - 1; n >= 0; --n) if (e.charCodeAt(n) === ft) {
				if (!s) {
					r = n + 1;
					break;
				}
			} else -1 === i && (s = !1, i = n + 1);
			return -1 === i ? "" : e.slice(r, i);
		},
		extname(e) {
			bt(e, "path");
			let t = -1, n = 0, r = -1, i = !0, s = 0;
			for (let o = e.length - 1; o >= 0; --o) {
				const a = e[o];
				if ("/" !== a) -1 === r && (i = !1, r = o + 1), "." === a ? -1 === t ? t = o : 1 !== s && (s = 1) : -1 !== t && (s = -1);
				else if (!i) {
					n = o + 1;
					break;
				}
			}
			return -1 === t || -1 === r || 0 === s || 1 === s && t === r - 1 && t === n + 1 ? "" : e.slice(t, r);
		},
		format: St.bind(null, "/"),
		parse(e) {
			bt(e, "path");
			const t = {
				root: "",
				dir: "",
				base: "",
				ext: "",
				name: ""
			};
			if (0 === e.length) return t;
			const n = e.charCodeAt(0) === ft;
			let r;
			n ? (t.root = "/", r = 1) : r = 0;
			let i = -1, s = 0, o = -1, a = !0, l = e.length - 1, u = 0;
			for (; l >= r; --l) {
				const t = e.charCodeAt(l);
				if (t !== ft) -1 === o && (a = !1, o = l + 1), t === dt ? -1 === i ? i = l : 1 !== u && (u = 1) : -1 !== i && (u = -1);
				else if (!a) {
					s = l + 1;
					break;
				}
			}
			if (-1 !== o) {
				const r = 0 === s && n ? 1 : s;
				-1 === i || 0 === u || 1 === u && i === o - 1 && i === s + 1 ? t.base = t.name = e.slice(r, o) : (t.name = e.slice(r, i), t.base = e.slice(r, o), t.ext = e.slice(i, o));
			}
			return s > 0 ? t.dir = e.slice(0, s - 1) : n && (t.dir = "/"), t;
		},
		sep: "/",
		delimiter: ":",
		win32: null,
		posix: null
	};
	xt.win32 = Lt.win32 = Lt, xt.posix = Lt.posix = xt;
	yt ? Lt.normalize : xt.normalize, yt ? Lt.resolve : xt.resolve, yt ? Lt.relative : xt.relative, yt ? Lt.dirname : xt.dirname, yt ? Lt.basename : xt.basename, yt ? Lt.extname : xt.extname, yt ? Lt.sep : xt.sep;
	const Et = /^\w[\w\d+.-]*$/, At = /^\//, kt = /^\/\//;
	const Rt = "", Tt = "/", Mt = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
	var Ot = class e {
		static isUri(t) {
			return t instanceof e || !(!t || "object" != typeof t) && "string" == typeof t.authority && "string" == typeof t.fragment && "string" == typeof t.path && "string" == typeof t.query && "string" == typeof t.scheme && "string" == typeof t.fsPath && "function" == typeof t.with && "function" == typeof t.toString;
		}
		constructor(e, t, n, r, i, s = !1) {
			"object" == typeof e ? (this.scheme = e.scheme || Rt, this.authority = e.authority || Rt, this.path = e.path || Rt, this.query = e.query || Rt, this.fragment = e.fragment || Rt) : (this.scheme = function(e, t) {
				return e || t ? e : "file";
			}(e, s), this.authority = t || Rt, this.path = function(e, t) {
				switch (e) {
					case "https":
					case "http":
					case "file": t ? t[0] !== Tt && (t = Tt + t) : t = Tt;
				}
				return t;
			}(this.scheme, n || Rt), this.query = r || Rt, this.fragment = i || Rt, function(e, t) {
				if (!e.scheme && t) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);
				if (e.scheme && !Et.test(e.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
				if (e.path) {
					if (e.authority) {
						if (!At.test(e.path)) throw new Error("[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash (\"/\") character");
					} else if (kt.test(e.path)) throw new Error("[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters (\"//\")");
				}
			}(this, s));
		}
		get fsPath() {
			return qt(this, !1);
		}
		with(e) {
			if (!e) return this;
			let { scheme: t, authority: n, path: r, query: i, fragment: s } = e;
			return void 0 === t ? t = this.scheme : null === t && (t = Rt), void 0 === n ? n = this.authority : null === n && (n = Rt), void 0 === r ? r = this.path : null === r && (r = Rt), void 0 === i ? i = this.query : null === i && (i = Rt), void 0 === s ? s = this.fragment : null === s && (s = Rt), t === this.scheme && n === this.authority && r === this.path && i === this.query && s === this.fragment ? this : new Pt(t, n, r, i, s);
		}
		static parse(e, t = !1) {
			const n = Mt.exec(e);
			return n ? new Pt(n[2] || Rt, Ut(n[4] || Rt), Ut(n[5] || Rt), Ut(n[7] || Rt), Ut(n[9] || Rt), t) : new Pt(Rt, Rt, Rt, Rt, Rt);
		}
		static file(e) {
			let t = Rt;
			if (z && (e = e.replace(/\\/g, Tt)), e[0] === Tt && e[1] === Tt) {
				const n = e.indexOf(Tt, 2);
				-1 === n ? (t = e.substring(2), e = Tt) : (t = e.substring(2, n), e = e.substring(n) || Tt);
			}
			return new Pt("file", t, e, Rt, Rt);
		}
		static from(e, t) {
			return new Pt(e.scheme, e.authority, e.path, e.query, e.fragment, t);
		}
		static joinPath(t, ...n) {
			if (!t.path) throw new Error("[UriError]: cannot call joinPath on URI without path");
			let r;
			return r = z && "file" === t.scheme ? e.file(Lt.join(qt(t, !0), ...n)).path : xt.join(t.path, ...n), t.with({ path: r });
		}
		toString(e = !1) {
			return Kt(this, e);
		}
		toJSON() {
			return this;
		}
		static revive(t) {
			if (t) {
				if (t instanceof e) return t;
				{
					const e = new Pt(t);
					return e._formatted = t.external ?? null, e._fsPath = t._sep === It ? t.fsPath ?? null : null, e;
				}
			}
			return t;
		}
	};
	const It = z ? 1 : void 0;
	var Pt = class extends Ot {
		constructor() {
			super(...arguments), this._formatted = null, this._fsPath = null;
		}
		get fsPath() {
			return this._fsPath || (this._fsPath = qt(this, !1)), this._fsPath;
		}
		toString(e = !1) {
			return e ? Kt(this, !0) : (this._formatted || (this._formatted = Kt(this, !1)), this._formatted);
		}
		toJSON() {
			const e = { $mid: 1 };
			return this._fsPath && (e.fsPath = this._fsPath, e._sep = It), this._formatted && (e.external = this._formatted), this.path && (e.path = this.path), this.scheme && (e.scheme = this.scheme), this.authority && (e.authority = this.authority), this.query && (e.query = this.query), this.fragment && (e.fragment = this.fragment), e;
		}
	};
	const Vt = {
		58: "%3A",
		47: "%2F",
		63: "%3F",
		35: "%23",
		91: "%5B",
		93: "%5D",
		64: "%40",
		33: "%21",
		36: "%24",
		38: "%26",
		39: "%27",
		40: "%28",
		41: "%29",
		42: "%2A",
		43: "%2B",
		44: "%2C",
		59: "%3B",
		61: "%3D",
		32: "%20"
	};
	function Ft(e, t, n) {
		let r, i = -1;
		for (let s = 0; s < e.length; s++) {
			const o = e.charCodeAt(s);
			if (o >= 97 && o <= 122 || o >= 65 && o <= 90 || o >= 48 && o <= 57 || 45 === o || 46 === o || 95 === o || 126 === o || t && 47 === o || n && 91 === o || n && 93 === o || n && 58 === o) -1 !== i && (r += encodeURIComponent(e.substring(i, s)), i = -1), void 0 !== r && (r += e.charAt(s));
			else {
				void 0 === r && (r = e.substr(0, s));
				const t = Vt[o];
				void 0 !== t ? (-1 !== i && (r += encodeURIComponent(e.substring(i, s)), i = -1), r += t) : -1 === i && (i = s);
			}
		}
		return -1 !== i && (r += encodeURIComponent(e.substring(i))), void 0 !== r ? r : e;
	}
	function Dt(e) {
		let t;
		for (let n = 0; n < e.length; n++) {
			const r = e.charCodeAt(n);
			35 === r || 63 === r ? (void 0 === t && (t = e.substr(0, n)), t += Vt[r]) : void 0 !== t && (t += e[n]);
		}
		return void 0 !== t ? t : e;
	}
	function qt(e, t) {
		let n;
		return n = e.authority && e.path.length > 1 && "file" === e.scheme ? `//${e.authority}${e.path}` : 47 === e.path.charCodeAt(0) && (e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90 || e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122) && 58 === e.path.charCodeAt(2) ? t ? e.path.substr(1) : e.path[1].toLowerCase() + e.path.substr(2) : e.path, z && (n = n.replace(/\//g, "\\")), n;
	}
	function Kt(e, t) {
		const n = t ? Dt : Ft;
		let r = "", { scheme: i, authority: s, path: o, query: a, fragment: l } = e;
		if (i && (r += i, r += ":"), (s || "file" === i) && (r += Tt, r += Tt), s) {
			let e = s.indexOf("@");
			if (-1 !== e) {
				const t = s.substr(0, e);
				s = s.substr(e + 1), e = t.lastIndexOf(":"), -1 === e ? r += n(t, !1, !1) : (r += n(t.substr(0, e), !1, !1), r += ":", r += n(t.substr(e + 1), !1, !0)), r += "@";
			}
			s = s.toLowerCase(), e = s.lastIndexOf(":"), -1 === e ? r += n(s, !1, !0) : (r += n(s.substr(0, e), !1, !0), r += s.substr(e));
		}
		if (o) {
			if (o.length >= 3 && 47 === o.charCodeAt(0) && 58 === o.charCodeAt(2)) {
				const e = o.charCodeAt(1);
				e >= 65 && e <= 90 && (o = `/${String.fromCharCode(e + 32)}:${o.substr(3)}`);
			} else if (o.length >= 2 && 58 === o.charCodeAt(1)) {
				const e = o.charCodeAt(0);
				e >= 65 && e <= 90 && (o = `${String.fromCharCode(e + 32)}:${o.substr(2)}`);
			}
			r += n(o, !0, !1);
		}
		return a && (r += "?", r += n(a, !1, !1)), l && (r += "#", r += t ? l : Ft(l, !1, !1)), r;
	}
	function Bt(e) {
		try {
			return decodeURIComponent(e);
		} catch {
			return e.length > 3 ? e.substr(0, 3) + Bt(e.substr(3)) : e;
		}
	}
	const $t = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
	function Ut(e) {
		return e.match($t) ? e.replace($t, (e) => Bt(e)) : e;
	}
	var jt = class e extends De {
		constructor(e, t, n, r) {
			super(e, t, n, r), this.selectionStartLineNumber = e, this.selectionStartColumn = t, this.positionLineNumber = n, this.positionColumn = r;
		}
		toString() {
			return "[" + this.selectionStartLineNumber + "," + this.selectionStartColumn + " -> " + this.positionLineNumber + "," + this.positionColumn + "]";
		}
		equalsSelection(t) {
			return e.selectionsEqual(this, t);
		}
		static selectionsEqual(e, t) {
			return e.selectionStartLineNumber === t.selectionStartLineNumber && e.selectionStartColumn === t.selectionStartColumn && e.positionLineNumber === t.positionLineNumber && e.positionColumn === t.positionColumn;
		}
		getDirection() {
			return this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn ? 0 : 1;
		}
		setEndPosition(t, n) {
			return 0 === this.getDirection() ? new e(this.startLineNumber, this.startColumn, t, n) : new e(t, n, this.startLineNumber, this.startColumn);
		}
		getPosition() {
			return new Fe(this.positionLineNumber, this.positionColumn);
		}
		getSelectionStart() {
			return new Fe(this.selectionStartLineNumber, this.selectionStartColumn);
		}
		setStartPosition(t, n) {
			return 0 === this.getDirection() ? new e(t, n, this.endLineNumber, this.endColumn) : new e(this.endLineNumber, this.endColumn, t, n);
		}
		static fromPositions(t, n = t) {
			return new e(t.lineNumber, t.column, n.lineNumber, n.column);
		}
		static fromRange(t, n) {
			return 0 === n ? new e(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : new e(t.endLineNumber, t.endColumn, t.startLineNumber, t.startColumn);
		}
		static liftSelection(t) {
			return new e(t.selectionStartLineNumber, t.selectionStartColumn, t.positionLineNumber, t.positionColumn);
		}
		static selectionsArrEqual(e, t) {
			if (e && !t || !e && t) return !1;
			if (!e && !t) return !0;
			if (e.length !== t.length) return !1;
			for (let n = 0, r = e.length; n < r; n++) if (!this.selectionsEqual(e[n], t[n])) return !1;
			return !0;
		}
		static isISelection(e) {
			return !!e && "number" == typeof e.selectionStartLineNumber && "number" == typeof e.selectionStartColumn && "number" == typeof e.positionLineNumber && "number" == typeof e.positionColumn;
		}
		static createWithDirection(t, n, r, i, s) {
			return 0 === s ? new e(t, n, r, i) : new e(r, i, t, n);
		}
	};
	const Wt = Object.create(null);
	function zt(e, t) {
		if ("string" == typeof t) {
			const n = Wt[t];
			if (void 0 === n) throw new Error(`${e} references an unknown codicon: ${t}`);
			t = n;
		}
		return Wt[e] = t, { id: e };
	}
	const Ht = {
		add: zt("add", 6e4),
		plus: zt("plus", 6e4),
		gistNew: zt("gist-new", 6e4),
		repoCreate: zt("repo-create", 6e4),
		lightbulb: zt("lightbulb", 60001),
		lightBulb: zt("light-bulb", 60001),
		repo: zt("repo", 60002),
		repoDelete: zt("repo-delete", 60002),
		gistFork: zt("gist-fork", 60003),
		repoForked: zt("repo-forked", 60003),
		gitPullRequest: zt("git-pull-request", 60004),
		gitPullRequestAbandoned: zt("git-pull-request-abandoned", 60004),
		recordKeys: zt("record-keys", 60005),
		keyboard: zt("keyboard", 60005),
		tag: zt("tag", 60006),
		gitPullRequestLabel: zt("git-pull-request-label", 60006),
		tagAdd: zt("tag-add", 60006),
		tagRemove: zt("tag-remove", 60006),
		person: zt("person", 60007),
		personFollow: zt("person-follow", 60007),
		personOutline: zt("person-outline", 60007),
		personFilled: zt("person-filled", 60007),
		sourceControl: zt("source-control", 60008),
		mirror: zt("mirror", 60009),
		mirrorPublic: zt("mirror-public", 60009),
		star: zt("star", 60010),
		starAdd: zt("star-add", 60010),
		starDelete: zt("star-delete", 60010),
		starEmpty: zt("star-empty", 60010),
		comment: zt("comment", 60011),
		commentAdd: zt("comment-add", 60011),
		alert: zt("alert", 60012),
		warning: zt("warning", 60012),
		search: zt("search", 60013),
		searchSave: zt("search-save", 60013),
		logOut: zt("log-out", 60014),
		signOut: zt("sign-out", 60014),
		logIn: zt("log-in", 60015),
		signIn: zt("sign-in", 60015),
		eye: zt("eye", 60016),
		eyeUnwatch: zt("eye-unwatch", 60016),
		eyeWatch: zt("eye-watch", 60016),
		circleFilled: zt("circle-filled", 60017),
		primitiveDot: zt("primitive-dot", 60017),
		closeDirty: zt("close-dirty", 60017),
		debugBreakpoint: zt("debug-breakpoint", 60017),
		debugBreakpointDisabled: zt("debug-breakpoint-disabled", 60017),
		debugHint: zt("debug-hint", 60017),
		terminalDecorationSuccess: zt("terminal-decoration-success", 60017),
		primitiveSquare: zt("primitive-square", 60018),
		edit: zt("edit", 60019),
		pencil: zt("pencil", 60019),
		info: zt("info", 60020),
		issueOpened: zt("issue-opened", 60020),
		gistPrivate: zt("gist-private", 60021),
		gitForkPrivate: zt("git-fork-private", 60021),
		lock: zt("lock", 60021),
		mirrorPrivate: zt("mirror-private", 60021),
		close: zt("close", 60022),
		removeClose: zt("remove-close", 60022),
		x: zt("x", 60022),
		repoSync: zt("repo-sync", 60023),
		sync: zt("sync", 60023),
		clone: zt("clone", 60024),
		desktopDownload: zt("desktop-download", 60024),
		beaker: zt("beaker", 60025),
		microscope: zt("microscope", 60025),
		vm: zt("vm", 60026),
		deviceDesktop: zt("device-desktop", 60026),
		file: zt("file", 60027),
		more: zt("more", 60028),
		ellipsis: zt("ellipsis", 60028),
		kebabHorizontal: zt("kebab-horizontal", 60028),
		mailReply: zt("mail-reply", 60029),
		reply: zt("reply", 60029),
		organization: zt("organization", 60030),
		organizationFilled: zt("organization-filled", 60030),
		organizationOutline: zt("organization-outline", 60030),
		newFile: zt("new-file", 60031),
		fileAdd: zt("file-add", 60031),
		newFolder: zt("new-folder", 60032),
		fileDirectoryCreate: zt("file-directory-create", 60032),
		trash: zt("trash", 60033),
		trashcan: zt("trashcan", 60033),
		history: zt("history", 60034),
		clock: zt("clock", 60034),
		folder: zt("folder", 60035),
		fileDirectory: zt("file-directory", 60035),
		symbolFolder: zt("symbol-folder", 60035),
		logoGithub: zt("logo-github", 60036),
		markGithub: zt("mark-github", 60036),
		github: zt("github", 60036),
		terminal: zt("terminal", 60037),
		console: zt("console", 60037),
		repl: zt("repl", 60037),
		zap: zt("zap", 60038),
		symbolEvent: zt("symbol-event", 60038),
		error: zt("error", 60039),
		stop: zt("stop", 60039),
		variable: zt("variable", 60040),
		symbolVariable: zt("symbol-variable", 60040),
		array: zt("array", 60042),
		symbolArray: zt("symbol-array", 60042),
		symbolModule: zt("symbol-module", 60043),
		symbolPackage: zt("symbol-package", 60043),
		symbolNamespace: zt("symbol-namespace", 60043),
		symbolObject: zt("symbol-object", 60043),
		symbolMethod: zt("symbol-method", 60044),
		symbolFunction: zt("symbol-function", 60044),
		symbolConstructor: zt("symbol-constructor", 60044),
		symbolBoolean: zt("symbol-boolean", 60047),
		symbolNull: zt("symbol-null", 60047),
		symbolNumeric: zt("symbol-numeric", 60048),
		symbolNumber: zt("symbol-number", 60048),
		symbolStructure: zt("symbol-structure", 60049),
		symbolStruct: zt("symbol-struct", 60049),
		symbolParameter: zt("symbol-parameter", 60050),
		symbolTypeParameter: zt("symbol-type-parameter", 60050),
		symbolKey: zt("symbol-key", 60051),
		symbolText: zt("symbol-text", 60051),
		symbolReference: zt("symbol-reference", 60052),
		goToFile: zt("go-to-file", 60052),
		symbolEnum: zt("symbol-enum", 60053),
		symbolValue: zt("symbol-value", 60053),
		symbolRuler: zt("symbol-ruler", 60054),
		symbolUnit: zt("symbol-unit", 60054),
		activateBreakpoints: zt("activate-breakpoints", 60055),
		archive: zt("archive", 60056),
		arrowBoth: zt("arrow-both", 60057),
		arrowDown: zt("arrow-down", 60058),
		arrowLeft: zt("arrow-left", 60059),
		arrowRight: zt("arrow-right", 60060),
		arrowSmallDown: zt("arrow-small-down", 60061),
		arrowSmallLeft: zt("arrow-small-left", 60062),
		arrowSmallRight: zt("arrow-small-right", 60063),
		arrowSmallUp: zt("arrow-small-up", 60064),
		arrowUp: zt("arrow-up", 60065),
		bell: zt("bell", 60066),
		bold: zt("bold", 60067),
		book: zt("book", 60068),
		bookmark: zt("bookmark", 60069),
		debugBreakpointConditionalUnverified: zt("debug-breakpoint-conditional-unverified", 60070),
		debugBreakpointConditional: zt("debug-breakpoint-conditional", 60071),
		debugBreakpointConditionalDisabled: zt("debug-breakpoint-conditional-disabled", 60071),
		debugBreakpointDataUnverified: zt("debug-breakpoint-data-unverified", 60072),
		debugBreakpointData: zt("debug-breakpoint-data", 60073),
		debugBreakpointDataDisabled: zt("debug-breakpoint-data-disabled", 60073),
		debugBreakpointLogUnverified: zt("debug-breakpoint-log-unverified", 60074),
		debugBreakpointLog: zt("debug-breakpoint-log", 60075),
		debugBreakpointLogDisabled: zt("debug-breakpoint-log-disabled", 60075),
		briefcase: zt("briefcase", 60076),
		broadcast: zt("broadcast", 60077),
		browser: zt("browser", 60078),
		bug: zt("bug", 60079),
		calendar: zt("calendar", 60080),
		caseSensitive: zt("case-sensitive", 60081),
		check: zt("check", 60082),
		checklist: zt("checklist", 60083),
		chevronDown: zt("chevron-down", 60084),
		chevronLeft: zt("chevron-left", 60085),
		chevronRight: zt("chevron-right", 60086),
		chevronUp: zt("chevron-up", 60087),
		chromeClose: zt("chrome-close", 60088),
		chromeMaximize: zt("chrome-maximize", 60089),
		chromeMinimize: zt("chrome-minimize", 60090),
		chromeRestore: zt("chrome-restore", 60091),
		circleOutline: zt("circle-outline", 60092),
		circle: zt("circle", 60092),
		debugBreakpointUnverified: zt("debug-breakpoint-unverified", 60092),
		terminalDecorationIncomplete: zt("terminal-decoration-incomplete", 60092),
		circleSlash: zt("circle-slash", 60093),
		circuitBoard: zt("circuit-board", 60094),
		clearAll: zt("clear-all", 60095),
		clippy: zt("clippy", 60096),
		closeAll: zt("close-all", 60097),
		cloudDownload: zt("cloud-download", 60098),
		cloudUpload: zt("cloud-upload", 60099),
		code: zt("code", 60100),
		collapseAll: zt("collapse-all", 60101),
		colorMode: zt("color-mode", 60102),
		commentDiscussion: zt("comment-discussion", 60103),
		creditCard: zt("credit-card", 60105),
		dash: zt("dash", 60108),
		dashboard: zt("dashboard", 60109),
		database: zt("database", 60110),
		debugContinue: zt("debug-continue", 60111),
		debugDisconnect: zt("debug-disconnect", 60112),
		debugPause: zt("debug-pause", 60113),
		debugRestart: zt("debug-restart", 60114),
		debugStart: zt("debug-start", 60115),
		debugStepInto: zt("debug-step-into", 60116),
		debugStepOut: zt("debug-step-out", 60117),
		debugStepOver: zt("debug-step-over", 60118),
		debugStop: zt("debug-stop", 60119),
		debug: zt("debug", 60120),
		deviceCameraVideo: zt("device-camera-video", 60121),
		deviceCamera: zt("device-camera", 60122),
		deviceMobile: zt("device-mobile", 60123),
		diffAdded: zt("diff-added", 60124),
		diffIgnored: zt("diff-ignored", 60125),
		diffModified: zt("diff-modified", 60126),
		diffRemoved: zt("diff-removed", 60127),
		diffRenamed: zt("diff-renamed", 60128),
		diff: zt("diff", 60129),
		diffSidebyside: zt("diff-sidebyside", 60129),
		discard: zt("discard", 60130),
		editorLayout: zt("editor-layout", 60131),
		emptyWindow: zt("empty-window", 60132),
		exclude: zt("exclude", 60133),
		extensions: zt("extensions", 60134),
		eyeClosed: zt("eye-closed", 60135),
		fileBinary: zt("file-binary", 60136),
		fileCode: zt("file-code", 60137),
		fileMedia: zt("file-media", 60138),
		filePdf: zt("file-pdf", 60139),
		fileSubmodule: zt("file-submodule", 60140),
		fileSymlinkDirectory: zt("file-symlink-directory", 60141),
		fileSymlinkFile: zt("file-symlink-file", 60142),
		fileZip: zt("file-zip", 60143),
		files: zt("files", 60144),
		filter: zt("filter", 60145),
		flame: zt("flame", 60146),
		foldDown: zt("fold-down", 60147),
		foldUp: zt("fold-up", 60148),
		fold: zt("fold", 60149),
		folderActive: zt("folder-active", 60150),
		folderOpened: zt("folder-opened", 60151),
		gear: zt("gear", 60152),
		gift: zt("gift", 60153),
		gistSecret: zt("gist-secret", 60154),
		gist: zt("gist", 60155),
		gitCommit: zt("git-commit", 60156),
		gitCompare: zt("git-compare", 60157),
		compareChanges: zt("compare-changes", 60157),
		gitMerge: zt("git-merge", 60158),
		githubAction: zt("github-action", 60159),
		githubAlt: zt("github-alt", 60160),
		globe: zt("globe", 60161),
		grabber: zt("grabber", 60162),
		graph: zt("graph", 60163),
		gripper: zt("gripper", 60164),
		heart: zt("heart", 60165),
		home: zt("home", 60166),
		horizontalRule: zt("horizontal-rule", 60167),
		hubot: zt("hubot", 60168),
		inbox: zt("inbox", 60169),
		issueReopened: zt("issue-reopened", 60171),
		issues: zt("issues", 60172),
		italic: zt("italic", 60173),
		jersey: zt("jersey", 60174),
		json: zt("json", 60175),
		kebabVertical: zt("kebab-vertical", 60176),
		key: zt("key", 60177),
		law: zt("law", 60178),
		lightbulbAutofix: zt("lightbulb-autofix", 60179),
		linkExternal: zt("link-external", 60180),
		link: zt("link", 60181),
		listOrdered: zt("list-ordered", 60182),
		listUnordered: zt("list-unordered", 60183),
		liveShare: zt("live-share", 60184),
		loading: zt("loading", 60185),
		location: zt("location", 60186),
		mailRead: zt("mail-read", 60187),
		mail: zt("mail", 60188),
		markdown: zt("markdown", 60189),
		megaphone: zt("megaphone", 60190),
		mention: zt("mention", 60191),
		milestone: zt("milestone", 60192),
		gitPullRequestMilestone: zt("git-pull-request-milestone", 60192),
		mortarBoard: zt("mortar-board", 60193),
		move: zt("move", 60194),
		multipleWindows: zt("multiple-windows", 60195),
		mute: zt("mute", 60196),
		noNewline: zt("no-newline", 60197),
		note: zt("note", 60198),
		octoface: zt("octoface", 60199),
		openPreview: zt("open-preview", 60200),
		package: zt("package", 60201),
		paintcan: zt("paintcan", 60202),
		pin: zt("pin", 60203),
		play: zt("play", 60204),
		run: zt("run", 60204),
		plug: zt("plug", 60205),
		preserveCase: zt("preserve-case", 60206),
		preview: zt("preview", 60207),
		project: zt("project", 60208),
		pulse: zt("pulse", 60209),
		question: zt("question", 60210),
		quote: zt("quote", 60211),
		radioTower: zt("radio-tower", 60212),
		reactions: zt("reactions", 60213),
		references: zt("references", 60214),
		refresh: zt("refresh", 60215),
		regex: zt("regex", 60216),
		remoteExplorer: zt("remote-explorer", 60217),
		remote: zt("remote", 60218),
		remove: zt("remove", 60219),
		replaceAll: zt("replace-all", 60220),
		replace: zt("replace", 60221),
		repoClone: zt("repo-clone", 60222),
		repoForcePush: zt("repo-force-push", 60223),
		repoPull: zt("repo-pull", 60224),
		repoPush: zt("repo-push", 60225),
		report: zt("report", 60226),
		requestChanges: zt("request-changes", 60227),
		rocket: zt("rocket", 60228),
		rootFolderOpened: zt("root-folder-opened", 60229),
		rootFolder: zt("root-folder", 60230),
		rss: zt("rss", 60231),
		ruby: zt("ruby", 60232),
		saveAll: zt("save-all", 60233),
		saveAs: zt("save-as", 60234),
		save: zt("save", 60235),
		screenFull: zt("screen-full", 60236),
		screenNormal: zt("screen-normal", 60237),
		searchStop: zt("search-stop", 60238),
		server: zt("server", 60240),
		settingsGear: zt("settings-gear", 60241),
		settings: zt("settings", 60242),
		shield: zt("shield", 60243),
		smiley: zt("smiley", 60244),
		sortPrecedence: zt("sort-precedence", 60245),
		splitHorizontal: zt("split-horizontal", 60246),
		splitVertical: zt("split-vertical", 60247),
		squirrel: zt("squirrel", 60248),
		starFull: zt("star-full", 60249),
		starHalf: zt("star-half", 60250),
		symbolClass: zt("symbol-class", 60251),
		symbolColor: zt("symbol-color", 60252),
		symbolConstant: zt("symbol-constant", 60253),
		symbolEnumMember: zt("symbol-enum-member", 60254),
		symbolField: zt("symbol-field", 60255),
		symbolFile: zt("symbol-file", 60256),
		symbolInterface: zt("symbol-interface", 60257),
		symbolKeyword: zt("symbol-keyword", 60258),
		symbolMisc: zt("symbol-misc", 60259),
		symbolOperator: zt("symbol-operator", 60260),
		symbolProperty: zt("symbol-property", 60261),
		wrench: zt("wrench", 60261),
		wrenchSubaction: zt("wrench-subaction", 60261),
		symbolSnippet: zt("symbol-snippet", 60262),
		tasklist: zt("tasklist", 60263),
		telescope: zt("telescope", 60264),
		textSize: zt("text-size", 60265),
		threeBars: zt("three-bars", 60266),
		thumbsdown: zt("thumbsdown", 60267),
		thumbsup: zt("thumbsup", 60268),
		tools: zt("tools", 60269),
		triangleDown: zt("triangle-down", 60270),
		triangleLeft: zt("triangle-left", 60271),
		triangleRight: zt("triangle-right", 60272),
		triangleUp: zt("triangle-up", 60273),
		twitter: zt("twitter", 60274),
		unfold: zt("unfold", 60275),
		unlock: zt("unlock", 60276),
		unmute: zt("unmute", 60277),
		unverified: zt("unverified", 60278),
		verified: zt("verified", 60279),
		versions: zt("versions", 60280),
		vmActive: zt("vm-active", 60281),
		vmOutline: zt("vm-outline", 60282),
		vmRunning: zt("vm-running", 60283),
		watch: zt("watch", 60284),
		whitespace: zt("whitespace", 60285),
		wholeWord: zt("whole-word", 60286),
		window: zt("window", 60287),
		wordWrap: zt("word-wrap", 60288),
		zoomIn: zt("zoom-in", 60289),
		zoomOut: zt("zoom-out", 60290),
		listFilter: zt("list-filter", 60291),
		listFlat: zt("list-flat", 60292),
		listSelection: zt("list-selection", 60293),
		selection: zt("selection", 60293),
		listTree: zt("list-tree", 60294),
		debugBreakpointFunctionUnverified: zt("debug-breakpoint-function-unverified", 60295),
		debugBreakpointFunction: zt("debug-breakpoint-function", 60296),
		debugBreakpointFunctionDisabled: zt("debug-breakpoint-function-disabled", 60296),
		debugStackframeActive: zt("debug-stackframe-active", 60297),
		circleSmallFilled: zt("circle-small-filled", 60298),
		debugStackframeDot: zt("debug-stackframe-dot", 60298),
		terminalDecorationMark: zt("terminal-decoration-mark", 60298),
		debugStackframe: zt("debug-stackframe", 60299),
		debugStackframeFocused: zt("debug-stackframe-focused", 60299),
		debugBreakpointUnsupported: zt("debug-breakpoint-unsupported", 60300),
		symbolString: zt("symbol-string", 60301),
		debugReverseContinue: zt("debug-reverse-continue", 60302),
		debugStepBack: zt("debug-step-back", 60303),
		debugRestartFrame: zt("debug-restart-frame", 60304),
		debugAlt: zt("debug-alt", 60305),
		callIncoming: zt("call-incoming", 60306),
		callOutgoing: zt("call-outgoing", 60307),
		menu: zt("menu", 60308),
		expandAll: zt("expand-all", 60309),
		feedback: zt("feedback", 60310),
		gitPullRequestReviewer: zt("git-pull-request-reviewer", 60310),
		groupByRefType: zt("group-by-ref-type", 60311),
		ungroupByRefType: zt("ungroup-by-ref-type", 60312),
		account: zt("account", 60313),
		gitPullRequestAssignee: zt("git-pull-request-assignee", 60313),
		bellDot: zt("bell-dot", 60314),
		debugConsole: zt("debug-console", 60315),
		library: zt("library", 60316),
		output: zt("output", 60317),
		runAll: zt("run-all", 60318),
		syncIgnored: zt("sync-ignored", 60319),
		pinned: zt("pinned", 60320),
		githubInverted: zt("github-inverted", 60321),
		serverProcess: zt("server-process", 60322),
		serverEnvironment: zt("server-environment", 60323),
		pass: zt("pass", 60324),
		issueClosed: zt("issue-closed", 60324),
		stopCircle: zt("stop-circle", 60325),
		playCircle: zt("play-circle", 60326),
		record: zt("record", 60327),
		debugAltSmall: zt("debug-alt-small", 60328),
		vmConnect: zt("vm-connect", 60329),
		cloud: zt("cloud", 60330),
		merge: zt("merge", 60331),
		export: zt("export", 60332),
		graphLeft: zt("graph-left", 60333),
		magnet: zt("magnet", 60334),
		notebook: zt("notebook", 60335),
		redo: zt("redo", 60336),
		checkAll: zt("check-all", 60337),
		pinnedDirty: zt("pinned-dirty", 60338),
		passFilled: zt("pass-filled", 60339),
		circleLargeFilled: zt("circle-large-filled", 60340),
		circleLarge: zt("circle-large", 60341),
		circleLargeOutline: zt("circle-large-outline", 60341),
		combine: zt("combine", 60342),
		gather: zt("gather", 60342),
		table: zt("table", 60343),
		variableGroup: zt("variable-group", 60344),
		typeHierarchy: zt("type-hierarchy", 60345),
		typeHierarchySub: zt("type-hierarchy-sub", 60346),
		typeHierarchySuper: zt("type-hierarchy-super", 60347),
		gitPullRequestCreate: zt("git-pull-request-create", 60348),
		runAbove: zt("run-above", 60349),
		runBelow: zt("run-below", 60350),
		notebookTemplate: zt("notebook-template", 60351),
		debugRerun: zt("debug-rerun", 60352),
		workspaceTrusted: zt("workspace-trusted", 60353),
		workspaceUntrusted: zt("workspace-untrusted", 60354),
		workspaceUnknown: zt("workspace-unknown", 60355),
		terminalCmd: zt("terminal-cmd", 60356),
		terminalDebian: zt("terminal-debian", 60357),
		terminalLinux: zt("terminal-linux", 60358),
		terminalPowershell: zt("terminal-powershell", 60359),
		terminalTmux: zt("terminal-tmux", 60360),
		terminalUbuntu: zt("terminal-ubuntu", 60361),
		terminalBash: zt("terminal-bash", 60362),
		arrowSwap: zt("arrow-swap", 60363),
		copy: zt("copy", 60364),
		personAdd: zt("person-add", 60365),
		filterFilled: zt("filter-filled", 60366),
		wand: zt("wand", 60367),
		debugLineByLine: zt("debug-line-by-line", 60368),
		inspect: zt("inspect", 60369),
		layers: zt("layers", 60370),
		layersDot: zt("layers-dot", 60371),
		layersActive: zt("layers-active", 60372),
		compass: zt("compass", 60373),
		compassDot: zt("compass-dot", 60374),
		compassActive: zt("compass-active", 60375),
		azure: zt("azure", 60376),
		issueDraft: zt("issue-draft", 60377),
		gitPullRequestClosed: zt("git-pull-request-closed", 60378),
		gitPullRequestDraft: zt("git-pull-request-draft", 60379),
		debugAll: zt("debug-all", 60380),
		debugCoverage: zt("debug-coverage", 60381),
		runErrors: zt("run-errors", 60382),
		folderLibrary: zt("folder-library", 60383),
		debugContinueSmall: zt("debug-continue-small", 60384),
		beakerStop: zt("beaker-stop", 60385),
		graphLine: zt("graph-line", 60386),
		graphScatter: zt("graph-scatter", 60387),
		pieChart: zt("pie-chart", 60388),
		bracket: zt("bracket", 60175),
		bracketDot: zt("bracket-dot", 60389),
		bracketError: zt("bracket-error", 60390),
		lockSmall: zt("lock-small", 60391),
		azureDevops: zt("azure-devops", 60392),
		verifiedFilled: zt("verified-filled", 60393),
		newline: zt("newline", 60394),
		layout: zt("layout", 60395),
		layoutActivitybarLeft: zt("layout-activitybar-left", 60396),
		layoutActivitybarRight: zt("layout-activitybar-right", 60397),
		layoutPanelLeft: zt("layout-panel-left", 60398),
		layoutPanelCenter: zt("layout-panel-center", 60399),
		layoutPanelJustify: zt("layout-panel-justify", 60400),
		layoutPanelRight: zt("layout-panel-right", 60401),
		layoutPanel: zt("layout-panel", 60402),
		layoutSidebarLeft: zt("layout-sidebar-left", 60403),
		layoutSidebarRight: zt("layout-sidebar-right", 60404),
		layoutStatusbar: zt("layout-statusbar", 60405),
		layoutMenubar: zt("layout-menubar", 60406),
		layoutCentered: zt("layout-centered", 60407),
		target: zt("target", 60408),
		indent: zt("indent", 60409),
		recordSmall: zt("record-small", 60410),
		errorSmall: zt("error-small", 60411),
		terminalDecorationError: zt("terminal-decoration-error", 60411),
		arrowCircleDown: zt("arrow-circle-down", 60412),
		arrowCircleLeft: zt("arrow-circle-left", 60413),
		arrowCircleRight: zt("arrow-circle-right", 60414),
		arrowCircleUp: zt("arrow-circle-up", 60415),
		layoutSidebarRightOff: zt("layout-sidebar-right-off", 60416),
		layoutPanelOff: zt("layout-panel-off", 60417),
		layoutSidebarLeftOff: zt("layout-sidebar-left-off", 60418),
		blank: zt("blank", 60419),
		heartFilled: zt("heart-filled", 60420),
		map: zt("map", 60421),
		mapHorizontal: zt("map-horizontal", 60421),
		foldHorizontal: zt("fold-horizontal", 60421),
		mapFilled: zt("map-filled", 60422),
		mapHorizontalFilled: zt("map-horizontal-filled", 60422),
		foldHorizontalFilled: zt("fold-horizontal-filled", 60422),
		circleSmall: zt("circle-small", 60423),
		bellSlash: zt("bell-slash", 60424),
		bellSlashDot: zt("bell-slash-dot", 60425),
		commentUnresolved: zt("comment-unresolved", 60426),
		gitPullRequestGoToChanges: zt("git-pull-request-go-to-changes", 60427),
		gitPullRequestNewChanges: zt("git-pull-request-new-changes", 60428),
		searchFuzzy: zt("search-fuzzy", 60429),
		commentDraft: zt("comment-draft", 60430),
		send: zt("send", 60431),
		sparkle: zt("sparkle", 60432),
		insert: zt("insert", 60433),
		mic: zt("mic", 60434),
		thumbsdownFilled: zt("thumbsdown-filled", 60435),
		thumbsupFilled: zt("thumbsup-filled", 60436),
		coffee: zt("coffee", 60437),
		snake: zt("snake", 60438),
		game: zt("game", 60439),
		vr: zt("vr", 60440),
		chip: zt("chip", 60441),
		piano: zt("piano", 60442),
		music: zt("music", 60443),
		micFilled: zt("mic-filled", 60444),
		repoFetch: zt("repo-fetch", 60445),
		copilot: zt("copilot", 60446),
		lightbulbSparkle: zt("lightbulb-sparkle", 60447),
		robot: zt("robot", 60448),
		sparkleFilled: zt("sparkle-filled", 60449),
		diffSingle: zt("diff-single", 60450),
		diffMultiple: zt("diff-multiple", 60451),
		surroundWith: zt("surround-with", 60452),
		share: zt("share", 60453),
		gitStash: zt("git-stash", 60454),
		gitStashApply: zt("git-stash-apply", 60455),
		gitStashPop: zt("git-stash-pop", 60456),
		vscode: zt("vscode", 60457),
		vscodeInsiders: zt("vscode-insiders", 60458),
		codeOss: zt("code-oss", 60459),
		runCoverage: zt("run-coverage", 60460),
		runAllCoverage: zt("run-all-coverage", 60461),
		coverage: zt("coverage", 60462),
		githubProject: zt("github-project", 60463),
		mapVertical: zt("map-vertical", 60464),
		foldVertical: zt("fold-vertical", 60464),
		mapVerticalFilled: zt("map-vertical-filled", 60465),
		foldVerticalFilled: zt("fold-vertical-filled", 60465),
		goToSearch: zt("go-to-search", 60466),
		percentage: zt("percentage", 60467),
		sortPercentage: zt("sort-percentage", 60467),
		attach: zt("attach", 60468),
		goToEditingSession: zt("go-to-editing-session", 60469),
		editSession: zt("edit-session", 60470),
		codeReview: zt("code-review", 60471),
		copilotWarning: zt("copilot-warning", 60472),
		python: zt("python", 60473),
		copilotLarge: zt("copilot-large", 60474),
		copilotWarningLarge: zt("copilot-warning-large", 60475),
		keyboardTab: zt("keyboard-tab", 60476),
		copilotBlocked: zt("copilot-blocked", 60477),
		copilotNotConnected: zt("copilot-not-connected", 60478),
		flag: zt("flag", 60479),
		lightbulbEmpty: zt("lightbulb-empty", 60480),
		symbolMethodArrow: zt("symbol-method-arrow", 60481),
		copilotUnavailable: zt("copilot-unavailable", 60482),
		repoPinned: zt("repo-pinned", 60483),
		keyboardTabAbove: zt("keyboard-tab-above", 60484),
		keyboardTabBelow: zt("keyboard-tab-below", 60485),
		gitPullRequestDone: zt("git-pull-request-done", 60486),
		mcp: zt("mcp", 60487),
		extensionsLarge: zt("extensions-large", 60488),
		layoutPanelDock: zt("layout-panel-dock", 60489),
		layoutSidebarLeftDock: zt("layout-sidebar-left-dock", 60490),
		layoutSidebarRightDock: zt("layout-sidebar-right-dock", 60491),
		copilotInProgress: zt("copilot-in-progress", 60492),
		copilotError: zt("copilot-error", 60493),
		copilotSuccess: zt("copilot-success", 60494),
		chatSparkle: zt("chat-sparkle", 60495),
		searchSparkle: zt("search-sparkle", 60496),
		editSparkle: zt("edit-sparkle", 60497),
		copilotSnooze: zt("copilot-snooze", 60498),
		sendToRemoteAgent: zt("send-to-remote-agent", 60499),
		commentDiscussionSparkle: zt("comment-discussion-sparkle", 60500),
		chatSparkleWarning: zt("chat-sparkle-warning", 60501),
		chatSparkleError: zt("chat-sparkle-error", 60502),
		collection: zt("collection", 60503),
		newCollection: zt("new-collection", 60504),
		thinking: zt("thinking", 60505),
		build: zt("build", 60506),
		commentDiscussionQuote: zt("comment-discussion-quote", 60507),
		cursor: zt("cursor", 60508),
		eraser: zt("eraser", 60509),
		fileText: zt("file-text", 60510),
		gitLens: zt("git-lens", 60511),
		quotes: zt("quotes", 60512),
		rename: zt("rename", 60513),
		runWithDeps: zt("run-with-deps", 60514),
		debugConnected: zt("debug-connected", 60515),
		strikethrough: zt("strikethrough", 60516),
		openInProduct: zt("open-in-product", 60517),
		indexZero: zt("index-zero", 60518),
		agent: zt("agent", 60519),
		editCode: zt("edit-code", 60520),
		repoSelected: zt("repo-selected", 60521),
		skip: zt("skip", 60522),
		mergeInto: zt("merge-into", 60523),
		gitBranchChanges: zt("git-branch-changes", 60524),
		gitBranchStagedChanges: zt("git-branch-staged-changes", 60525),
		gitBranchConflicts: zt("git-branch-conflicts", 60526),
		gitBranch: zt("git-branch", 60527),
		gitBranchCreate: zt("git-branch-create", 60527),
		gitBranchDelete: zt("git-branch-delete", 60527),
		searchLarge: zt("search-large", 60528),
		terminalGitBash: zt("terminal-git-bash", 60529),
		dialogError: zt("dialog-error", "error"),
		dialogWarning: zt("dialog-warning", "warning"),
		dialogInfo: zt("dialog-info", "info"),
		dialogClose: zt("dialog-close", "close"),
		treeItemExpanded: zt("tree-item-expanded", "chevron-down"),
		treeFilterOnTypeOn: zt("tree-filter-on-type-on", "list-filter"),
		treeFilterOnTypeOff: zt("tree-filter-on-type-off", "list-selection"),
		treeFilterClear: zt("tree-filter-clear", "close"),
		treeItemLoading: zt("tree-item-loading", "loading"),
		menuSelection: zt("menu-selection", "check"),
		menuSubmenu: zt("menu-submenu", "chevron-right"),
		menuBarMore: zt("menubar-more", "more"),
		scrollbarButtonLeft: zt("scrollbar-button-left", "triangle-left"),
		scrollbarButtonRight: zt("scrollbar-button-right", "triangle-right"),
		scrollbarButtonUp: zt("scrollbar-button-up", "triangle-up"),
		scrollbarButtonDown: zt("scrollbar-button-down", "triangle-down"),
		toolBarMore: zt("toolbar-more", "more"),
		quickInputBack: zt("quick-input-back", "arrow-left"),
		dropDownButton: zt("drop-down-button", 60084),
		symbolCustomColor: zt("symbol-customcolor", 60252),
		exportIcon: zt("export", 60332),
		workspaceUnspecified: zt("workspace-unspecified", 60355),
		newLine: zt("newline", 60394),
		thumbsDownFilled: zt("thumbsdown-filled", 60435),
		thumbsUpFilled: zt("thumbsup-filled", 60436),
		gitFetch: zt("git-fetch", 60445),
		lightbulbSparkleAutofix: zt("lightbulb-sparkle-autofix", 60447),
		debugBreakpointPending: zt("debug-breakpoint-pending", 60377)
	};
	var Gt, Jt, Xt, Qt, Zt, Yt, en, tn, nn = class extends g {
		get isResolved() {
			return this._isResolved;
		}
		constructor(e, t, n) {
			super(), this._registry = e, this._languageId = t, this._factory = n, this._isDisposed = !1, this._resolvePromise = null, this._isResolved = !1;
		}
		dispose() {
			this._isDisposed = !0, super.dispose();
		}
		async resolve() {
			return this._resolvePromise || (this._resolvePromise = this._create()), this._resolvePromise;
		}
		async _create() {
			const e = await this._factory.tokenizationSupport;
			this._isResolved = !0, e && !this._isDisposed && this._register(this._registry.register(this._languageId, e));
		}
	}, rn = class {
		constructor(e, t, n) {
			this.offset = e, this.type = t, this.language = n, this._tokenBrand = void 0;
		}
		toString() {
			return "(" + this.offset + ", " + this.type + ")";
		}
	};
	(function(e) {
		e[e.Increase = 0] = "Increase", e[e.Decrease = 1] = "Decrease";
	})(Gt || (Gt = {})), function(e) {
		const t = /* @__PURE__ */ new Map();
		t.set(0, Ht.symbolMethod), t.set(1, Ht.symbolFunction), t.set(2, Ht.symbolConstructor), t.set(3, Ht.symbolField), t.set(4, Ht.symbolVariable), t.set(5, Ht.symbolClass), t.set(6, Ht.symbolStruct), t.set(7, Ht.symbolInterface), t.set(8, Ht.symbolModule), t.set(9, Ht.symbolProperty), t.set(10, Ht.symbolEvent), t.set(11, Ht.symbolOperator), t.set(12, Ht.symbolUnit), t.set(13, Ht.symbolValue), t.set(15, Ht.symbolEnum), t.set(14, Ht.symbolConstant), t.set(15, Ht.symbolEnum), t.set(16, Ht.symbolEnumMember), t.set(17, Ht.symbolKeyword), t.set(28, Ht.symbolSnippet), t.set(18, Ht.symbolText), t.set(19, Ht.symbolColor), t.set(20, Ht.symbolFile), t.set(21, Ht.symbolReference), t.set(22, Ht.symbolCustomColor), t.set(23, Ht.symbolFolder), t.set(24, Ht.symbolTypeParameter), t.set(25, Ht.account), t.set(26, Ht.issues), t.set(27, Ht.tools), e.toIcon = function(e) {
			let n = t.get(e);
			return n || (n = Ht.symbolProperty), n;
		}, e.toLabel = function(e) {
			switch (e) {
				case 0: return M(728, "Method");
				case 1: return M(729, "Function");
				case 2: return M(730, "Constructor");
				case 3: return M(731, "Field");
				case 4: return M(732, "Variable");
				case 5: return M(733, "Class");
				case 6: return M(734, "Struct");
				case 7: return M(735, "Interface");
				case 8: return M(736, "Module");
				case 9: return M(737, "Property");
				case 10: return M(738, "Event");
				case 11: return M(739, "Operator");
				case 12: return M(740, "Unit");
				case 13: return M(741, "Value");
				case 14: return M(742, "Constant");
				case 15: return M(743, "Enum");
				case 16: return M(744, "Enum Member");
				case 17: return M(745, "Keyword");
				case 18: return M(746, "Text");
				case 19: return M(747, "Color");
				case 20: return M(748, "File");
				case 21: return M(749, "Reference");
				case 22: return M(750, "Custom Color");
				case 23: return M(751, "Folder");
				case 24: return M(752, "Type Parameter");
				case 25: return M(753, "User");
				case 26: return M(754, "Issue");
				case 27: return M(755, "Tool");
				case 28: return M(756, "Snippet");
				default: return "";
			}
		};
		const n = /* @__PURE__ */ new Map();
		n.set("method", 0), n.set("function", 1), n.set("constructor", 2), n.set("field", 3), n.set("variable", 4), n.set("class", 5), n.set("struct", 6), n.set("interface", 7), n.set("module", 8), n.set("property", 9), n.set("event", 10), n.set("operator", 11), n.set("unit", 12), n.set("value", 13), n.set("constant", 14), n.set("enum", 15), n.set("enum-member", 16), n.set("enumMember", 16), n.set("keyword", 17), n.set("snippet", 28), n.set("text", 18), n.set("color", 19), n.set("file", 20), n.set("reference", 21), n.set("customcolor", 22), n.set("folder", 23), n.set("type-parameter", 24), n.set("typeParameter", 24), n.set("account", 25), n.set("issue", 26), n.set("tool", 27), e.fromString = function(e, t) {
			let r = n.get(e);
			return void 0 !== r || t || (r = 9), r;
		};
	}(Jt || (Jt = {})), function(e) {
		e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
	}(Xt || (Xt = {})), function(e) {
		e[e.Code = 1] = "Code", e[e.Label = 2] = "Label";
	}(Qt || (Qt = {})), function(e) {
		e[e.Accepted = 0] = "Accepted", e[e.Rejected = 1] = "Rejected", e[e.Ignored = 2] = "Ignored";
	}(Zt || (Zt = {})), function(e) {
		e[e.Automatic = 0] = "Automatic", e[e.PasteAs = 1] = "PasteAs";
	}(Yt || (Yt = {})), function(e) {
		e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
	}(en || (en = {})), function(e) {
		e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
	}(tn || (tn = {}));
	M(757, "array"), M(758, "boolean"), M(759, "class"), M(760, "constant"), M(761, "constructor"), M(762, "enumeration"), M(763, "enumeration member"), M(764, "event"), M(765, "field"), M(766, "file"), M(767, "function"), M(768, "interface"), M(769, "key"), M(770, "method"), M(771, "module"), M(772, "namespace"), M(773, "null"), M(774, "number"), M(775, "object"), M(776, "operator"), M(777, "package"), M(778, "property"), M(779, "string"), M(780, "struct"), M(781, "type parameter"), M(782, "variable");
	var sn;
	(function(e) {
		const t = /* @__PURE__ */ new Map();
		t.set(0, Ht.symbolFile), t.set(1, Ht.symbolModule), t.set(2, Ht.symbolNamespace), t.set(3, Ht.symbolPackage), t.set(4, Ht.symbolClass), t.set(5, Ht.symbolMethod), t.set(6, Ht.symbolProperty), t.set(7, Ht.symbolField), t.set(8, Ht.symbolConstructor), t.set(9, Ht.symbolEnum), t.set(10, Ht.symbolInterface), t.set(11, Ht.symbolFunction), t.set(12, Ht.symbolVariable), t.set(13, Ht.symbolConstant), t.set(14, Ht.symbolString), t.set(15, Ht.symbolNumber), t.set(16, Ht.symbolBoolean), t.set(17, Ht.symbolArray), t.set(18, Ht.symbolObject), t.set(19, Ht.symbolKey), t.set(20, Ht.symbolNull), t.set(21, Ht.symbolEnumMember), t.set(22, Ht.symbolStruct), t.set(23, Ht.symbolEvent), t.set(24, Ht.symbolOperator), t.set(25, Ht.symbolTypeParameter), e.toIcon = function(e) {
			let n = t.get(e);
			return n || (n = Ht.symbolProperty), n;
		};
		const n = /* @__PURE__ */ new Map();
		n.set(0, 20), n.set(1, 8), n.set(2, 8), n.set(3, 8), n.set(4, 5), n.set(5, 0), n.set(6, 9), n.set(7, 3), n.set(8, 2), n.set(9, 15), n.set(10, 7), n.set(11, 1), n.set(12, 4), n.set(13, 14), n.set(14, 18), n.set(15, 13), n.set(16, 13), n.set(17, 13), n.set(18, 13), n.set(19, 17), n.set(20, 13), n.set(21, 16), n.set(22, 6), n.set(23, 10), n.set(24, 11), n.set(25, 24), e.toCompletionKind = function(e) {
			let t = n.get(e);
			return void 0 === t && (t = 20), t;
		};
	})(sn || (sn = {}));
	var on, an, ln, un;
	(class e {
		static {
			this.Comment = new e("comment");
		}
		static {
			this.Imports = new e("imports");
		}
		static {
			this.Region = new e("region");
		}
		static fromValue(t) {
			switch (t) {
				case "comment": return e.Comment;
				case "imports": return e.Imports;
				case "region": return e.Region;
			}
			return new e(t);
		}
		constructor(e) {
			this.value = e;
		}
	});
	(function(e) {
		e[e.AIGenerated = 1] = "AIGenerated";
	})(on || (on = {})), function(e) {
		e[e.Invoke = 0] = "Invoke", e[e.Automatic = 1] = "Automatic";
	}(an || (an = {})), function(e) {
		e.is = function(e) {
			return !(!e || "object" != typeof e) && "string" == typeof e.id && "string" == typeof e.title;
		};
	}(ln || (ln = {})), function(e) {
		e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
	}(un || (un = {}));
	new class {
		constructor() {
			this._tokenizationSupports = /* @__PURE__ */ new Map(), this._factories = /* @__PURE__ */ new Map(), this._onDidChange = new E(), this.onDidChange = this._onDidChange.event, this._colorMap = null;
		}
		handleChange(e) {
			this._onDidChange.fire({
				changedLanguages: e,
				changedColorMap: !1
			});
		}
		register(e, t) {
			return this._tokenizationSupports.set(e, t), this.handleChange([e]), f(() => {
				this._tokenizationSupports.get(e) === t && (this._tokenizationSupports.delete(e), this.handleChange([e]));
			});
		}
		get(e) {
			return this._tokenizationSupports.get(e) || null;
		}
		registerFactory(e, t) {
			this._factories.get(e)?.dispose();
			const n = new nn(this, e, t);
			return this._factories.set(e, n), f(() => {
				const t = this._factories.get(e);
				t && t === n && (this._factories.delete(e), t.dispose());
			});
		}
		async getOrCreate(e) {
			const t = this.get(e);
			if (t) return t;
			const n = this._factories.get(e);
			return !n || n.isResolved ? null : (await n.resolve(), this.get(e));
		}
		isResolved(e) {
			if (this.get(e)) return !0;
			const t = this._factories.get(e);
			return !(t && !t.isResolved);
		}
		setColorMap(e) {
			this._colorMap = e, this._onDidChange.fire({
				changedLanguages: Array.from(this._tokenizationSupports.keys()),
				changedColorMap: !0
			});
		}
		getColorMap() {
			return this._colorMap;
		}
		getDefaultBackground() {
			return this._colorMap && this._colorMap.length > 2 ? this._colorMap[2] : null;
		}
	}();
	var cn, hn, dn, fn, mn, gn, pn, bn, yn, vn, wn, _n, Cn, Sn, Ln, Nn, xn, En, An, kn, Rn, Tn, Mn, On, In, Pn, Vn, Fn, Dn, qn, Kn, Bn, $n, Un, jn, Wn, zn, Hn, Gn, Jn, Xn, Qn, Zn, Yn, er, tr, nr, rr;
	(function(e) {
		e[e.Unknown = 0] = "Unknown", e[e.Disabled = 1] = "Disabled", e[e.Enabled = 2] = "Enabled";
	})(cn || (cn = {})), function(e) {
		e[e.Invoke = 1] = "Invoke", e[e.Auto = 2] = "Auto";
	}(hn || (hn = {})), function(e) {
		e[e.None = 0] = "None", e[e.KeepWhitespace = 1] = "KeepWhitespace", e[e.InsertAsSnippet = 4] = "InsertAsSnippet";
	}(dn || (dn = {})), function(e) {
		e[e.Method = 0] = "Method", e[e.Function = 1] = "Function", e[e.Constructor = 2] = "Constructor", e[e.Field = 3] = "Field", e[e.Variable = 4] = "Variable", e[e.Class = 5] = "Class", e[e.Struct = 6] = "Struct", e[e.Interface = 7] = "Interface", e[e.Module = 8] = "Module", e[e.Property = 9] = "Property", e[e.Event = 10] = "Event", e[e.Operator = 11] = "Operator", e[e.Unit = 12] = "Unit", e[e.Value = 13] = "Value", e[e.Constant = 14] = "Constant", e[e.Enum = 15] = "Enum", e[e.EnumMember = 16] = "EnumMember", e[e.Keyword = 17] = "Keyword", e[e.Text = 18] = "Text", e[e.Color = 19] = "Color", e[e.File = 20] = "File", e[e.Reference = 21] = "Reference", e[e.Customcolor = 22] = "Customcolor", e[e.Folder = 23] = "Folder", e[e.TypeParameter = 24] = "TypeParameter", e[e.User = 25] = "User", e[e.Issue = 26] = "Issue", e[e.Tool = 27] = "Tool", e[e.Snippet = 28] = "Snippet";
	}(fn || (fn = {})), function(e) {
		e[e.Deprecated = 1] = "Deprecated";
	}(mn || (mn = {})), function(e) {
		e[e.Invoke = 0] = "Invoke", e[e.TriggerCharacter = 1] = "TriggerCharacter", e[e.TriggerForIncompleteCompletions = 2] = "TriggerForIncompleteCompletions";
	}(gn || (gn = {})), function(e) {
		e[e.EXACT = 0] = "EXACT", e[e.ABOVE = 1] = "ABOVE", e[e.BELOW = 2] = "BELOW";
	}(pn || (pn = {})), function(e) {
		e[e.NotSet = 0] = "NotSet", e[e.ContentFlush = 1] = "ContentFlush", e[e.RecoverFromMarkers = 2] = "RecoverFromMarkers", e[e.Explicit = 3] = "Explicit", e[e.Paste = 4] = "Paste", e[e.Undo = 5] = "Undo", e[e.Redo = 6] = "Redo";
	}(bn || (bn = {})), function(e) {
		e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
	}(yn || (yn = {})), function(e) {
		e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
	}(vn || (vn = {})), function(e) {
		e[e.None = 0] = "None", e[e.Keep = 1] = "Keep", e[e.Brackets = 2] = "Brackets", e[e.Advanced = 3] = "Advanced", e[e.Full = 4] = "Full";
	}(wn || (wn = {})), function(e) {
		e[e.acceptSuggestionOnCommitCharacter = 0] = "acceptSuggestionOnCommitCharacter", e[e.acceptSuggestionOnEnter = 1] = "acceptSuggestionOnEnter", e[e.accessibilitySupport = 2] = "accessibilitySupport", e[e.accessibilityPageSize = 3] = "accessibilityPageSize", e[e.allowOverflow = 4] = "allowOverflow", e[e.allowVariableLineHeights = 5] = "allowVariableLineHeights", e[e.allowVariableFonts = 6] = "allowVariableFonts", e[e.allowVariableFontsInAccessibilityMode = 7] = "allowVariableFontsInAccessibilityMode", e[e.ariaLabel = 8] = "ariaLabel", e[e.ariaRequired = 9] = "ariaRequired", e[e.autoClosingBrackets = 10] = "autoClosingBrackets", e[e.autoClosingComments = 11] = "autoClosingComments", e[e.screenReaderAnnounceInlineSuggestion = 12] = "screenReaderAnnounceInlineSuggestion", e[e.autoClosingDelete = 13] = "autoClosingDelete", e[e.autoClosingOvertype = 14] = "autoClosingOvertype", e[e.autoClosingQuotes = 15] = "autoClosingQuotes", e[e.autoIndent = 16] = "autoIndent", e[e.autoIndentOnPaste = 17] = "autoIndentOnPaste", e[e.autoIndentOnPasteWithinString = 18] = "autoIndentOnPasteWithinString", e[e.automaticLayout = 19] = "automaticLayout", e[e.autoSurround = 20] = "autoSurround", e[e.bracketPairColorization = 21] = "bracketPairColorization", e[e.guides = 22] = "guides", e[e.codeLens = 23] = "codeLens", e[e.codeLensFontFamily = 24] = "codeLensFontFamily", e[e.codeLensFontSize = 25] = "codeLensFontSize", e[e.colorDecorators = 26] = "colorDecorators", e[e.colorDecoratorsLimit = 27] = "colorDecoratorsLimit", e[e.columnSelection = 28] = "columnSelection", e[e.comments = 29] = "comments", e[e.contextmenu = 30] = "contextmenu", e[e.copyWithSyntaxHighlighting = 31] = "copyWithSyntaxHighlighting", e[e.cursorBlinking = 32] = "cursorBlinking", e[e.cursorSmoothCaretAnimation = 33] = "cursorSmoothCaretAnimation", e[e.cursorStyle = 34] = "cursorStyle", e[e.cursorSurroundingLines = 35] = "cursorSurroundingLines", e[e.cursorSurroundingLinesStyle = 36] = "cursorSurroundingLinesStyle", e[e.cursorWidth = 37] = "cursorWidth", e[e.cursorHeight = 38] = "cursorHeight", e[e.disableLayerHinting = 39] = "disableLayerHinting", e[e.disableMonospaceOptimizations = 40] = "disableMonospaceOptimizations", e[e.domReadOnly = 41] = "domReadOnly", e[e.dragAndDrop = 42] = "dragAndDrop", e[e.dropIntoEditor = 43] = "dropIntoEditor", e[e.editContext = 44] = "editContext", e[e.emptySelectionClipboard = 45] = "emptySelectionClipboard", e[e.experimentalGpuAcceleration = 46] = "experimentalGpuAcceleration", e[e.experimentalWhitespaceRendering = 47] = "experimentalWhitespaceRendering", e[e.extraEditorClassName = 48] = "extraEditorClassName", e[e.fastScrollSensitivity = 49] = "fastScrollSensitivity", e[e.find = 50] = "find", e[e.fixedOverflowWidgets = 51] = "fixedOverflowWidgets", e[e.folding = 52] = "folding", e[e.foldingStrategy = 53] = "foldingStrategy", e[e.foldingHighlight = 54] = "foldingHighlight", e[e.foldingImportsByDefault = 55] = "foldingImportsByDefault", e[e.foldingMaximumRegions = 56] = "foldingMaximumRegions", e[e.unfoldOnClickAfterEndOfLine = 57] = "unfoldOnClickAfterEndOfLine", e[e.fontFamily = 58] = "fontFamily", e[e.fontInfo = 59] = "fontInfo", e[e.fontLigatures = 60] = "fontLigatures", e[e.fontSize = 61] = "fontSize", e[e.fontWeight = 62] = "fontWeight", e[e.fontVariations = 63] = "fontVariations", e[e.formatOnPaste = 64] = "formatOnPaste", e[e.formatOnType = 65] = "formatOnType", e[e.glyphMargin = 66] = "glyphMargin", e[e.gotoLocation = 67] = "gotoLocation", e[e.hideCursorInOverviewRuler = 68] = "hideCursorInOverviewRuler", e[e.hover = 69] = "hover", e[e.inDiffEditor = 70] = "inDiffEditor", e[e.inlineSuggest = 71] = "inlineSuggest", e[e.letterSpacing = 72] = "letterSpacing", e[e.lightbulb = 73] = "lightbulb", e[e.lineDecorationsWidth = 74] = "lineDecorationsWidth", e[e.lineHeight = 75] = "lineHeight", e[e.lineNumbers = 76] = "lineNumbers", e[e.lineNumbersMinChars = 77] = "lineNumbersMinChars", e[e.linkedEditing = 78] = "linkedEditing", e[e.links = 79] = "links", e[e.matchBrackets = 80] = "matchBrackets", e[e.minimap = 81] = "minimap", e[e.mouseStyle = 82] = "mouseStyle", e[e.mouseWheelScrollSensitivity = 83] = "mouseWheelScrollSensitivity", e[e.mouseWheelZoom = 84] = "mouseWheelZoom", e[e.multiCursorMergeOverlapping = 85] = "multiCursorMergeOverlapping", e[e.multiCursorModifier = 86] = "multiCursorModifier", e[e.mouseMiddleClickAction = 87] = "mouseMiddleClickAction", e[e.multiCursorPaste = 88] = "multiCursorPaste", e[e.multiCursorLimit = 89] = "multiCursorLimit", e[e.occurrencesHighlight = 90] = "occurrencesHighlight", e[e.occurrencesHighlightDelay = 91] = "occurrencesHighlightDelay", e[e.overtypeCursorStyle = 92] = "overtypeCursorStyle", e[e.overtypeOnPaste = 93] = "overtypeOnPaste", e[e.overviewRulerBorder = 94] = "overviewRulerBorder", e[e.overviewRulerLanes = 95] = "overviewRulerLanes", e[e.padding = 96] = "padding", e[e.pasteAs = 97] = "pasteAs", e[e.parameterHints = 98] = "parameterHints", e[e.peekWidgetDefaultFocus = 99] = "peekWidgetDefaultFocus", e[e.placeholder = 100] = "placeholder", e[e.definitionLinkOpensInPeek = 101] = "definitionLinkOpensInPeek", e[e.quickSuggestions = 102] = "quickSuggestions", e[e.quickSuggestionsDelay = 103] = "quickSuggestionsDelay", e[e.readOnly = 104] = "readOnly", e[e.readOnlyMessage = 105] = "readOnlyMessage", e[e.renameOnType = 106] = "renameOnType", e[e.renderRichScreenReaderContent = 107] = "renderRichScreenReaderContent", e[e.renderControlCharacters = 108] = "renderControlCharacters", e[e.renderFinalNewline = 109] = "renderFinalNewline", e[e.renderLineHighlight = 110] = "renderLineHighlight", e[e.renderLineHighlightOnlyWhenFocus = 111] = "renderLineHighlightOnlyWhenFocus", e[e.renderValidationDecorations = 112] = "renderValidationDecorations", e[e.renderWhitespace = 113] = "renderWhitespace", e[e.revealHorizontalRightPadding = 114] = "revealHorizontalRightPadding", e[e.roundedSelection = 115] = "roundedSelection", e[e.rulers = 116] = "rulers", e[e.scrollbar = 117] = "scrollbar", e[e.scrollBeyondLastColumn = 118] = "scrollBeyondLastColumn", e[e.scrollBeyondLastLine = 119] = "scrollBeyondLastLine", e[e.scrollPredominantAxis = 120] = "scrollPredominantAxis", e[e.selectionClipboard = 121] = "selectionClipboard", e[e.selectionHighlight = 122] = "selectionHighlight", e[e.selectionHighlightMaxLength = 123] = "selectionHighlightMaxLength", e[e.selectionHighlightMultiline = 124] = "selectionHighlightMultiline", e[e.selectOnLineNumbers = 125] = "selectOnLineNumbers", e[e.showFoldingControls = 126] = "showFoldingControls", e[e.showUnused = 127] = "showUnused", e[e.snippetSuggestions = 128] = "snippetSuggestions", e[e.smartSelect = 129] = "smartSelect", e[e.smoothScrolling = 130] = "smoothScrolling", e[e.stickyScroll = 131] = "stickyScroll", e[e.stickyTabStops = 132] = "stickyTabStops", e[e.stopRenderingLineAfter = 133] = "stopRenderingLineAfter", e[e.suggest = 134] = "suggest", e[e.suggestFontSize = 135] = "suggestFontSize", e[e.suggestLineHeight = 136] = "suggestLineHeight", e[e.suggestOnTriggerCharacters = 137] = "suggestOnTriggerCharacters", e[e.suggestSelection = 138] = "suggestSelection", e[e.tabCompletion = 139] = "tabCompletion", e[e.tabIndex = 140] = "tabIndex", e[e.trimWhitespaceOnDelete = 141] = "trimWhitespaceOnDelete", e[e.unicodeHighlighting = 142] = "unicodeHighlighting", e[e.unusualLineTerminators = 143] = "unusualLineTerminators", e[e.useShadowDOM = 144] = "useShadowDOM", e[e.useTabStops = 145] = "useTabStops", e[e.wordBreak = 146] = "wordBreak", e[e.wordSegmenterLocales = 147] = "wordSegmenterLocales", e[e.wordSeparators = 148] = "wordSeparators", e[e.wordWrap = 149] = "wordWrap", e[e.wordWrapBreakAfterCharacters = 150] = "wordWrapBreakAfterCharacters", e[e.wordWrapBreakBeforeCharacters = 151] = "wordWrapBreakBeforeCharacters", e[e.wordWrapColumn = 152] = "wordWrapColumn", e[e.wordWrapOverride1 = 153] = "wordWrapOverride1", e[e.wordWrapOverride2 = 154] = "wordWrapOverride2", e[e.wrappingIndent = 155] = "wrappingIndent", e[e.wrappingStrategy = 156] = "wrappingStrategy", e[e.showDeprecated = 157] = "showDeprecated", e[e.inertialScroll = 158] = "inertialScroll", e[e.inlayHints = 159] = "inlayHints", e[e.wrapOnEscapedLineFeeds = 160] = "wrapOnEscapedLineFeeds", e[e.effectiveCursorStyle = 161] = "effectiveCursorStyle", e[e.editorClassName = 162] = "editorClassName", e[e.pixelRatio = 163] = "pixelRatio", e[e.tabFocusMode = 164] = "tabFocusMode", e[e.layoutInfo = 165] = "layoutInfo", e[e.wrappingInfo = 166] = "wrappingInfo", e[e.defaultColorDecorators = 167] = "defaultColorDecorators", e[e.colorDecoratorsActivatedOn = 168] = "colorDecoratorsActivatedOn", e[e.inlineCompletionsAccessibilityVerbose = 169] = "inlineCompletionsAccessibilityVerbose", e[e.effectiveEditContext = 170] = "effectiveEditContext", e[e.scrollOnMiddleClick = 171] = "scrollOnMiddleClick", e[e.effectiveAllowVariableFonts = 172] = "effectiveAllowVariableFonts";
	}(_n || (_n = {})), function(e) {
		e[e.TextDefined = 0] = "TextDefined", e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
	}(Cn || (Cn = {})), function(e) {
		e[e.LF = 0] = "LF", e[e.CRLF = 1] = "CRLF";
	}(Sn || (Sn = {})), function(e) {
		e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 3] = "Right";
	}(Ln || (Ln = {})), function(e) {
		e[e.Increase = 0] = "Increase", e[e.Decrease = 1] = "Decrease";
	}(Nn || (Nn = {})), function(e) {
		e[e.None = 0] = "None", e[e.Indent = 1] = "Indent", e[e.IndentOutdent = 2] = "IndentOutdent", e[e.Outdent = 3] = "Outdent";
	}(xn || (xn = {})), function(e) {
		e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
	}(En || (En = {})), function(e) {
		e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
	}(An || (An = {})), function(e) {
		e[e.Accepted = 0] = "Accepted", e[e.Rejected = 1] = "Rejected", e[e.Ignored = 2] = "Ignored";
	}(kn || (kn = {})), function(e) {
		e[e.Code = 1] = "Code", e[e.Label = 2] = "Label";
	}(Rn || (Rn = {})), function(e) {
		e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
	}(Tn || (Tn = {})), function(e) {
		e[e.DependsOnKbLayout = -1] = "DependsOnKbLayout", e[e.Unknown = 0] = "Unknown", e[e.Backspace = 1] = "Backspace", e[e.Tab = 2] = "Tab", e[e.Enter = 3] = "Enter", e[e.Shift = 4] = "Shift", e[e.Ctrl = 5] = "Ctrl", e[e.Alt = 6] = "Alt", e[e.PauseBreak = 7] = "PauseBreak", e[e.CapsLock = 8] = "CapsLock", e[e.Escape = 9] = "Escape", e[e.Space = 10] = "Space", e[e.PageUp = 11] = "PageUp", e[e.PageDown = 12] = "PageDown", e[e.End = 13] = "End", e[e.Home = 14] = "Home", e[e.LeftArrow = 15] = "LeftArrow", e[e.UpArrow = 16] = "UpArrow", e[e.RightArrow = 17] = "RightArrow", e[e.DownArrow = 18] = "DownArrow", e[e.Insert = 19] = "Insert", e[e.Delete = 20] = "Delete", e[e.Digit0 = 21] = "Digit0", e[e.Digit1 = 22] = "Digit1", e[e.Digit2 = 23] = "Digit2", e[e.Digit3 = 24] = "Digit3", e[e.Digit4 = 25] = "Digit4", e[e.Digit5 = 26] = "Digit5", e[e.Digit6 = 27] = "Digit6", e[e.Digit7 = 28] = "Digit7", e[e.Digit8 = 29] = "Digit8", e[e.Digit9 = 30] = "Digit9", e[e.KeyA = 31] = "KeyA", e[e.KeyB = 32] = "KeyB", e[e.KeyC = 33] = "KeyC", e[e.KeyD = 34] = "KeyD", e[e.KeyE = 35] = "KeyE", e[e.KeyF = 36] = "KeyF", e[e.KeyG = 37] = "KeyG", e[e.KeyH = 38] = "KeyH", e[e.KeyI = 39] = "KeyI", e[e.KeyJ = 40] = "KeyJ", e[e.KeyK = 41] = "KeyK", e[e.KeyL = 42] = "KeyL", e[e.KeyM = 43] = "KeyM", e[e.KeyN = 44] = "KeyN", e[e.KeyO = 45] = "KeyO", e[e.KeyP = 46] = "KeyP", e[e.KeyQ = 47] = "KeyQ", e[e.KeyR = 48] = "KeyR", e[e.KeyS = 49] = "KeyS", e[e.KeyT = 50] = "KeyT", e[e.KeyU = 51] = "KeyU", e[e.KeyV = 52] = "KeyV", e[e.KeyW = 53] = "KeyW", e[e.KeyX = 54] = "KeyX", e[e.KeyY = 55] = "KeyY", e[e.KeyZ = 56] = "KeyZ", e[e.Meta = 57] = "Meta", e[e.ContextMenu = 58] = "ContextMenu", e[e.F1 = 59] = "F1", e[e.F2 = 60] = "F2", e[e.F3 = 61] = "F3", e[e.F4 = 62] = "F4", e[e.F5 = 63] = "F5", e[e.F6 = 64] = "F6", e[e.F7 = 65] = "F7", e[e.F8 = 66] = "F8", e[e.F9 = 67] = "F9", e[e.F10 = 68] = "F10", e[e.F11 = 69] = "F11", e[e.F12 = 70] = "F12", e[e.F13 = 71] = "F13", e[e.F14 = 72] = "F14", e[e.F15 = 73] = "F15", e[e.F16 = 74] = "F16", e[e.F17 = 75] = "F17", e[e.F18 = 76] = "F18", e[e.F19 = 77] = "F19", e[e.F20 = 78] = "F20", e[e.F21 = 79] = "F21", e[e.F22 = 80] = "F22", e[e.F23 = 81] = "F23", e[e.F24 = 82] = "F24", e[e.NumLock = 83] = "NumLock", e[e.ScrollLock = 84] = "ScrollLock", e[e.Semicolon = 85] = "Semicolon", e[e.Equal = 86] = "Equal", e[e.Comma = 87] = "Comma", e[e.Minus = 88] = "Minus", e[e.Period = 89] = "Period", e[e.Slash = 90] = "Slash", e[e.Backquote = 91] = "Backquote", e[e.BracketLeft = 92] = "BracketLeft", e[e.Backslash = 93] = "Backslash", e[e.BracketRight = 94] = "BracketRight", e[e.Quote = 95] = "Quote", e[e.OEM_8 = 96] = "OEM_8", e[e.IntlBackslash = 97] = "IntlBackslash", e[e.Numpad0 = 98] = "Numpad0", e[e.Numpad1 = 99] = "Numpad1", e[e.Numpad2 = 100] = "Numpad2", e[e.Numpad3 = 101] = "Numpad3", e[e.Numpad4 = 102] = "Numpad4", e[e.Numpad5 = 103] = "Numpad5", e[e.Numpad6 = 104] = "Numpad6", e[e.Numpad7 = 105] = "Numpad7", e[e.Numpad8 = 106] = "Numpad8", e[e.Numpad9 = 107] = "Numpad9", e[e.NumpadMultiply = 108] = "NumpadMultiply", e[e.NumpadAdd = 109] = "NumpadAdd", e[e.NUMPAD_SEPARATOR = 110] = "NUMPAD_SEPARATOR", e[e.NumpadSubtract = 111] = "NumpadSubtract", e[e.NumpadDecimal = 112] = "NumpadDecimal", e[e.NumpadDivide = 113] = "NumpadDivide", e[e.KEY_IN_COMPOSITION = 114] = "KEY_IN_COMPOSITION", e[e.ABNT_C1 = 115] = "ABNT_C1", e[e.ABNT_C2 = 116] = "ABNT_C2", e[e.AudioVolumeMute = 117] = "AudioVolumeMute", e[e.AudioVolumeUp = 118] = "AudioVolumeUp", e[e.AudioVolumeDown = 119] = "AudioVolumeDown", e[e.BrowserSearch = 120] = "BrowserSearch", e[e.BrowserHome = 121] = "BrowserHome", e[e.BrowserBack = 122] = "BrowserBack", e[e.BrowserForward = 123] = "BrowserForward", e[e.MediaTrackNext = 124] = "MediaTrackNext", e[e.MediaTrackPrevious = 125] = "MediaTrackPrevious", e[e.MediaStop = 126] = "MediaStop", e[e.MediaPlayPause = 127] = "MediaPlayPause", e[e.LaunchMediaPlayer = 128] = "LaunchMediaPlayer", e[e.LaunchMail = 129] = "LaunchMail", e[e.LaunchApp2 = 130] = "LaunchApp2", e[e.Clear = 131] = "Clear", e[e.MAX_VALUE = 132] = "MAX_VALUE";
	}(Mn || (Mn = {})), function(e) {
		e[e.Hint = 1] = "Hint", e[e.Info = 2] = "Info", e[e.Warning = 4] = "Warning", e[e.Error = 8] = "Error";
	}(On || (On = {})), function(e) {
		e[e.Unnecessary = 1] = "Unnecessary", e[e.Deprecated = 2] = "Deprecated";
	}(In || (In = {})), function(e) {
		e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
	}(Pn || (Pn = {})), function(e) {
		e[e.Normal = 1] = "Normal", e[e.Underlined = 2] = "Underlined";
	}(Vn || (Vn = {})), function(e) {
		e[e.UNKNOWN = 0] = "UNKNOWN", e[e.TEXTAREA = 1] = "TEXTAREA", e[e.GUTTER_GLYPH_MARGIN = 2] = "GUTTER_GLYPH_MARGIN", e[e.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS", e[e.GUTTER_LINE_DECORATIONS = 4] = "GUTTER_LINE_DECORATIONS", e[e.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE", e[e.CONTENT_TEXT = 6] = "CONTENT_TEXT", e[e.CONTENT_EMPTY = 7] = "CONTENT_EMPTY", e[e.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE", e[e.CONTENT_WIDGET = 9] = "CONTENT_WIDGET", e[e.OVERVIEW_RULER = 10] = "OVERVIEW_RULER", e[e.SCROLLBAR = 11] = "SCROLLBAR", e[e.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET", e[e.OUTSIDE_EDITOR = 13] = "OUTSIDE_EDITOR";
	}(Fn || (Fn = {})), function(e) {
		e[e.AIGenerated = 1] = "AIGenerated";
	}(Dn || (Dn = {})), function(e) {
		e[e.Invoke = 0] = "Invoke", e[e.Automatic = 1] = "Automatic";
	}(qn || (qn = {})), function(e) {
		e[e.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER", e[e.BOTTOM_RIGHT_CORNER = 1] = "BOTTOM_RIGHT_CORNER", e[e.TOP_CENTER = 2] = "TOP_CENTER";
	}(Kn || (Kn = {})), function(e) {
		e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
	}(Bn || (Bn = {})), function(e) {
		e[e.Word = 0] = "Word", e[e.Line = 1] = "Line", e[e.Suggest = 2] = "Suggest";
	}($n || ($n = {})), function(e) {
		e[e.Left = 0] = "Left", e[e.Right = 1] = "Right", e[e.None = 2] = "None", e[e.LeftOfInjectedText = 3] = "LeftOfInjectedText", e[e.RightOfInjectedText = 4] = "RightOfInjectedText";
	}(Un || (Un = {})), function(e) {
		e[e.Off = 0] = "Off", e[e.On = 1] = "On", e[e.Relative = 2] = "Relative", e[e.Interval = 3] = "Interval", e[e.Custom = 4] = "Custom";
	}(jn || (jn = {})), function(e) {
		e[e.None = 0] = "None", e[e.Text = 1] = "Text", e[e.Blocks = 2] = "Blocks";
	}(Wn || (Wn = {})), function(e) {
		e[e.Smooth = 0] = "Smooth", e[e.Immediate = 1] = "Immediate";
	}(zn || (zn = {})), function(e) {
		e[e.Auto = 1] = "Auto", e[e.Hidden = 2] = "Hidden", e[e.Visible = 3] = "Visible";
	}(Hn || (Hn = {})), function(e) {
		e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
	}(Gn || (Gn = {})), function(e) {
		e.Off = "off", e.OnCode = "onCode", e.On = "on";
	}(Jn || (Jn = {})), function(e) {
		e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
	}(Xn || (Xn = {})), function(e) {
		e[e.File = 0] = "File", e[e.Module = 1] = "Module", e[e.Namespace = 2] = "Namespace", e[e.Package = 3] = "Package", e[e.Class = 4] = "Class", e[e.Method = 5] = "Method", e[e.Property = 6] = "Property", e[e.Field = 7] = "Field", e[e.Constructor = 8] = "Constructor", e[e.Enum = 9] = "Enum", e[e.Interface = 10] = "Interface", e[e.Function = 11] = "Function", e[e.Variable = 12] = "Variable", e[e.Constant = 13] = "Constant", e[e.String = 14] = "String", e[e.Number = 15] = "Number", e[e.Boolean = 16] = "Boolean", e[e.Array = 17] = "Array", e[e.Object = 18] = "Object", e[e.Key = 19] = "Key", e[e.Null = 20] = "Null", e[e.EnumMember = 21] = "EnumMember", e[e.Struct = 22] = "Struct", e[e.Event = 23] = "Event", e[e.Operator = 24] = "Operator", e[e.TypeParameter = 25] = "TypeParameter";
	}(Qn || (Qn = {})), function(e) {
		e[e.Deprecated = 1] = "Deprecated";
	}(Zn || (Zn = {})), function(e) {
		e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
	}(Yn || (Yn = {})), function(e) {
		e[e.Hidden = 0] = "Hidden", e[e.Blink = 1] = "Blink", e[e.Smooth = 2] = "Smooth", e[e.Phase = 3] = "Phase", e[e.Expand = 4] = "Expand", e[e.Solid = 5] = "Solid";
	}(er || (er = {})), function(e) {
		e[e.Line = 1] = "Line", e[e.Block = 2] = "Block", e[e.Underline = 3] = "Underline", e[e.LineThin = 4] = "LineThin", e[e.BlockOutline = 5] = "BlockOutline", e[e.UnderlineThin = 6] = "UnderlineThin";
	}(tr || (tr = {})), function(e) {
		e[e.AlwaysGrowsWhenTypingAtEdges = 0] = "AlwaysGrowsWhenTypingAtEdges", e[e.NeverGrowsWhenTypingAtEdges = 1] = "NeverGrowsWhenTypingAtEdges", e[e.GrowsOnlyWhenTypingBefore = 2] = "GrowsOnlyWhenTypingBefore", e[e.GrowsOnlyWhenTypingAfter = 3] = "GrowsOnlyWhenTypingAfter";
	}(nr || (nr = {})), function(e) {
		e[e.None = 0] = "None", e[e.Same = 1] = "Same", e[e.Indent = 2] = "Indent", e[e.DeepIndent = 3] = "DeepIndent";
	}(rr || (rr = {}));
	var ir, or, ar = class {
		static {
			this.CtrlCmd = 2048;
		}
		static {
			this.Shift = 1024;
		}
		static {
			this.Alt = 512;
		}
		static {
			this.WinCtrl = 256;
		}
		static chord(e, t) {
			return function(e, t) {
				return (e | (65535 & t) << 16 >>> 0) >>> 0;
			}(e, t);
		}
	};
	var lr = class {
		constructor(e, t) {
			this.uri = e, this.value = t;
		}
	};
	(class e {
		static {
			this.defaultToKey = (e) => e.toString();
		}
		constructor(t, n) {
			if (this[ir] = "ResourceMap", t instanceof e) this.map = new Map(t.map), this.toKey = n ?? e.defaultToKey;
			else if (function(e) {
				return Array.isArray(e);
			}(t)) {
				this.map = /* @__PURE__ */ new Map(), this.toKey = n ?? e.defaultToKey;
				for (const [e, n] of t) this.set(e, n);
			} else this.map = /* @__PURE__ */ new Map(), this.toKey = t ?? e.defaultToKey;
		}
		set(e, t) {
			return this.map.set(this.toKey(e), new lr(e, t)), this;
		}
		get(e) {
			return this.map.get(this.toKey(e))?.value;
		}
		has(e) {
			return this.map.has(this.toKey(e));
		}
		get size() {
			return this.map.size;
		}
		clear() {
			this.map.clear();
		}
		delete(e) {
			return this.map.delete(this.toKey(e));
		}
		forEach(e, t) {
			void 0 !== t && (e = e.bind(t));
			for (const [n, r] of this.map) e(r.value, r.uri, this);
		}
		*values() {
			for (const e of this.map.values()) yield e.value;
		}
		*keys() {
			for (const e of this.map.values()) yield e.uri;
		}
		*entries() {
			for (const e of this.map.values()) yield [e.uri, e.value];
		}
		*[(ir = Symbol.toStringTag, Symbol.iterator)]() {
			for (const [, e] of this.map) yield [e.uri, e.value];
		}
	});
	var cr = class {
		constructor() {
			this[or] = "LinkedMap", this._map = /* @__PURE__ */ new Map(), this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0;
		}
		clear() {
			this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++;
		}
		isEmpty() {
			return !this._head && !this._tail;
		}
		get size() {
			return this._size;
		}
		get first() {
			return this._head?.value;
		}
		get last() {
			return this._tail?.value;
		}
		has(e) {
			return this._map.has(e);
		}
		get(e, t = 0) {
			const n = this._map.get(e);
			if (n) return 0 !== t && this.touch(n, t), n.value;
		}
		set(e, t, n = 0) {
			let r = this._map.get(e);
			if (r) r.value = t, 0 !== n && this.touch(r, n);
			else {
				switch (r = {
					key: e,
					value: t,
					next: void 0,
					previous: void 0
				}, n) {
					case 0:
					case 2:
					default:
						this.addItemLast(r);
						break;
					case 1: this.addItemFirst(r);
				}
				this._map.set(e, r), this._size++;
			}
			return this;
		}
		delete(e) {
			return !!this.remove(e);
		}
		remove(e) {
			const t = this._map.get(e);
			if (t) return this._map.delete(e), this.removeItem(t), this._size--, t.value;
		}
		shift() {
			if (!this._head && !this._tail) return;
			if (!this._head || !this._tail) throw new Error("Invalid list");
			const e = this._head;
			return this._map.delete(e.key), this.removeItem(e), this._size--, e.value;
		}
		forEach(e, t) {
			const n = this._state;
			let r = this._head;
			for (; r;) {
				if (t ? e.bind(t)(r.value, r.key, this) : e(r.value, r.key, this), this._state !== n) throw new Error("LinkedMap got modified during iteration.");
				r = r.next;
			}
		}
		keys() {
			const e = this, t = this._state;
			let n = this._head;
			const r = {
				[Symbol.iterator]: () => r,
				next() {
					if (e._state !== t) throw new Error("LinkedMap got modified during iteration.");
					if (n) {
						const e = {
							value: n.key,
							done: !1
						};
						return n = n.next, e;
					}
					return {
						value: void 0,
						done: !0
					};
				}
			};
			return r;
		}
		values() {
			const e = this, t = this._state;
			let n = this._head;
			const r = {
				[Symbol.iterator]: () => r,
				next() {
					if (e._state !== t) throw new Error("LinkedMap got modified during iteration.");
					if (n) {
						const e = {
							value: n.value,
							done: !1
						};
						return n = n.next, e;
					}
					return {
						value: void 0,
						done: !0
					};
				}
			};
			return r;
		}
		entries() {
			const e = this, t = this._state;
			let n = this._head;
			const r = {
				[Symbol.iterator]: () => r,
				next() {
					if (e._state !== t) throw new Error("LinkedMap got modified during iteration.");
					if (n) {
						const e = {
							value: [n.key, n.value],
							done: !1
						};
						return n = n.next, e;
					}
					return {
						value: void 0,
						done: !0
					};
				}
			};
			return r;
		}
		[(or = Symbol.toStringTag, Symbol.iterator)]() {
			return this.entries();
		}
		trimOld(e) {
			if (e >= this.size) return;
			if (0 === e) return void this.clear();
			let t = this._head, n = this.size;
			for (; t && n > e;) this._map.delete(t.key), t = t.next, n--;
			this._head = t, this._size = n, t && (t.previous = void 0), this._state++;
		}
		trimNew(e) {
			if (e >= this.size) return;
			if (0 === e) return void this.clear();
			let t = this._tail, n = this.size;
			for (; t && n > e;) this._map.delete(t.key), t = t.previous, n--;
			this._tail = t, this._size = n, t && (t.next = void 0), this._state++;
		}
		addItemFirst(e) {
			if (this._head || this._tail) {
				if (!this._head) throw new Error("Invalid list");
				e.next = this._head, this._head.previous = e;
			} else this._tail = e;
			this._head = e, this._state++;
		}
		addItemLast(e) {
			if (this._head || this._tail) {
				if (!this._tail) throw new Error("Invalid list");
				e.previous = this._tail, this._tail.next = e;
			} else this._head = e;
			this._tail = e, this._state++;
		}
		removeItem(e) {
			if (e === this._head && e === this._tail) this._head = void 0, this._tail = void 0;
			else if (e === this._head) {
				if (!e.next) throw new Error("Invalid list");
				e.next.previous = void 0, this._head = e.next;
			} else if (e === this._tail) {
				if (!e.previous) throw new Error("Invalid list");
				e.previous.next = void 0, this._tail = e.previous;
			} else {
				const t = e.next, n = e.previous;
				if (!t || !n) throw new Error("Invalid list");
				t.previous = n, n.next = t;
			}
			e.next = void 0, e.previous = void 0, this._state++;
		}
		touch(e, t) {
			if (!this._head || !this._tail) throw new Error("Invalid list");
			if (1 === t || 2 === t) {
				if (1 === t) {
					if (e === this._head) return;
					const t = e.next, n = e.previous;
					e === this._tail ? (n.next = void 0, this._tail = n) : (t.previous = n, n.next = t), e.previous = void 0, e.next = this._head, this._head.previous = e, this._head = e, this._state++;
				} else if (2 === t) {
					if (e === this._tail) return;
					const t = e.next, n = e.previous;
					e === this._head ? (t.previous = void 0, this._head = t) : (t.previous = n, n.next = t), e.next = void 0, e.previous = this._tail, this._tail.next = e, this._tail = e, this._state++;
				}
			}
		}
		toJSON() {
			const e = [];
			return this.forEach((t, n) => {
				e.push([n, t]);
			}), e;
		}
		fromJSON(e) {
			this.clear();
			for (const [t, n] of e) this.set(t, n);
		}
	}, hr = class extends cr {
		constructor(e, t = 1) {
			super(), this._limit = e, this._ratio = Math.min(Math.max(0, t), 1);
		}
		get limit() {
			return this._limit;
		}
		set limit(e) {
			this._limit = e, this.checkTrim();
		}
		get(e, t = 2) {
			return super.get(e, t);
		}
		peek(e) {
			return super.get(e, 0);
		}
		set(e, t) {
			return super.set(e, t, 2), this;
		}
		checkTrim() {
			this.size > this._limit && this.trim(Math.round(this._limit * this._ratio));
		}
	}, dr = class {
		constructor() {
			this.map = /* @__PURE__ */ new Map();
		}
		add(e, t) {
			let n = this.map.get(e);
			n || (n = /* @__PURE__ */ new Set(), this.map.set(e, n)), n.add(t);
		}
		delete(e, t) {
			const n = this.map.get(e);
			n && (n.delete(t), 0 === n.size && this.map.delete(e));
		}
		forEach(e, t) {
			const n = this.map.get(e);
			n && n.forEach(t);
		}
	};
	new class extends hr {
		constructor(e, t = 1) {
			super(e, t);
		}
		trim(e) {
			this.trimOld(e);
		}
		set(e, t) {
			return super.set(e, t), this.checkTrim(), this;
		}
	}(10);
	var fr, mr, gr, pr;
	function br(e, t, n, r, i) {
		return function(e, t, n, r, i) {
			if (0 === r) return !0;
			const s = t.charCodeAt(r - 1);
			if (0 !== e.get(s)) return !0;
			if (13 === s || 10 === s) return !0;
			if (i > 0) {
				const n = t.charCodeAt(r);
				if (0 !== e.get(n)) return !0;
			}
			return !1;
		}(e, t, 0, r, i) && function(e, t, n, r, i) {
			if (r + i === n) return !0;
			const s = t.charCodeAt(r + i);
			if (0 !== e.get(s)) return !0;
			if (13 === s || 10 === s) return !0;
			if (i > 0) {
				const n = t.charCodeAt(r + i - 1);
				if (0 !== e.get(n)) return !0;
			}
			return !1;
		}(e, t, n, r, i);
	}
	(function(e) {
		e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
	})(fr || (fr = {})), function(e) {
		e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 3] = "Right";
	}(mr || (mr = {})), function(e) {
		e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
	}(gr || (gr = {})), function(e) {
		e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
	}(pr || (pr = {}));
	var yr = class {
		constructor(e, t) {
			this._wordSeparators = e, this._searchRegex = t, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
		}
		reset(e) {
			this._searchRegex.lastIndex = e, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
		}
		next(e) {
			const t = e.length;
			let n;
			do {
				if (this._prevMatchStartIndex + this._prevMatchLength === t) return null;
				if (n = this._searchRegex.exec(e), !n) return null;
				const r = n.index, i = n[0].length;
				if (r === this._prevMatchStartIndex && i === this._prevMatchLength) {
					if (0 === i) {
						oe(e, t, this._searchRegex.lastIndex) > 65535 ? this._searchRegex.lastIndex += 2 : this._searchRegex.lastIndex += 1;
						continue;
					}
					return null;
				}
				if (this._prevMatchStartIndex = r, this._prevMatchLength = i, !this._wordSeparators || br(this._wordSeparators, e, t, r, i)) return n;
			} while (n);
			return null;
		}
	};
	const vr = function(e = "") {
		let t = "(-?\\d*\\.\\d\\w*)|([^";
		for (const n of "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?") e.indexOf(n) >= 0 || (t += "\\" + n);
		return t += "\\s]+)", new RegExp(t, "g");
	}();
	function wr(e) {
		let t = vr;
		if (e && e instanceof RegExp) if (e.global) t = e;
		else {
			let n = "g";
			e.ignoreCase && (n += "i"), e.multiline && (n += "m"), e.unicode && (n += "u"), t = new RegExp(e.source, n);
		}
		return t.lastIndex = 0, t;
	}
	const _r = new b();
	function Cr(e, t, n, i, s) {
		if (t = wr(t), s || (s = r.first(_r)), n.length > s.maxLen) {
			let r = e - s.maxLen / 2;
			return r < 0 ? r = 0 : i += r, Cr(e, t, n = n.substring(r, e + s.maxLen / 2), i, s);
		}
		const o = Date.now(), a = e - 1 - i;
		let l = -1, u = null;
		for (let r = 1; !(Date.now() - o >= s.timeBudget); r++) {
			const e = a - s.windowSize * r;
			t.lastIndex = Math.max(0, e);
			const i = Sr(t, n, a, l);
			if (!i && u) break;
			if (u = i, e <= 0) break;
			l = e;
		}
		if (u) {
			const e = {
				word: u[0],
				startColumn: i + 1 + u.index,
				endColumn: i + 1 + u.index + u[0].length
			};
			return t.lastIndex = 0, e;
		}
		return null;
	}
	function Sr(e, t, n, r) {
		let i;
		for (; i = e.exec(t);) {
			const t = i.index || 0;
			if (t <= n && e.lastIndex >= n) return i;
			if (r > 0 && t > r) return null;
		}
		return null;
	}
	_r.unshift({
		maxLen: 1e3,
		windowSize: 15,
		timeBudget: 150
	});
	var Lr = class {
		static computeUnicodeHighlights(e, t, n) {
			const r = n ? n.startLineNumber : 1, i = n ? n.endLineNumber : e.getLineCount(), s = new Nr(t), o = s.getCandidateCodePoints();
			let l;
			var u, c;
			l = "allNonBasicAscii" === o ? /* @__PURE__ */ new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g") : new RegExp((u = Array.from(o), `[${c = u.map((e) => String.fromCodePoint(e)).join(""), c.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, "\\$&")}]`), "g");
			const h = new yr(null, l), d = [];
			let f, m = !1, g = 0, p = 0, b = 0;
			e: for (let y = r, v = i; y <= v; y++) {
				const t = e.getLineContent(y), n = t.length;
				h.reset(0);
				do
					if (f = h.next(t), f) {
						let e = f.index, r = f.index + f[0].length;
						e > 0 && re(t.charCodeAt(e - 1)) && e--, r + 1 < n && re(t.charCodeAt(r - 1)) && r++;
						const i = t.substring(e, r);
						let o = Cr(e + 1, vr, t, 0);
						o && o.endColumn <= e + 1 && (o = null);
						const l = s.shouldHighlightNonBasicASCII(i, o ? o.word : null);
						if (0 !== l) {
							if (3 === l ? g++ : 2 === l ? p++ : 1 === l ? b++ : a(), d.length >= 1e3) {
								m = !0;
								break e;
							}
							d.push(new De(y, e + 1, y, r + 1));
						}
					}
				while (f);
			}
			return {
				ranges: d,
				hasMore: m,
				ambiguousCharacterCount: g,
				invisibleCharacterCount: p,
				nonBasicAsciiCharacterCount: b
			};
		}
		static computeUnicodeHighlightReason(e, t) {
			const n = new Nr(t);
			switch (n.shouldHighlightNonBasicASCII(e, null)) {
				case 0: return null;
				case 2: return { kind: 1 };
				case 3: {
					const r = e.codePointAt(0), i = n.ambiguousCharacters.getPrimaryConfusable(r), s = ue.getLocales().filter((e) => !ue.getInstance(new Set([...t.allowedLocales, e])).isAmbiguous(r));
					return {
						kind: 0,
						confusableWith: String.fromCodePoint(i),
						notAmbiguousInLocales: s
					};
				}
				case 1: return { kind: 2 };
			}
		}
	};
	var Nr = class {
		constructor(e) {
			this.options = e, this.allowedCodePoints = new Set(e.allowedCodePoints), this.ambiguousCharacters = ue.getInstance(new Set(e.allowedLocales));
		}
		getCandidateCodePoints() {
			if (this.options.nonBasicASCII) return "allNonBasicAscii";
			const e = /* @__PURE__ */ new Set();
			if (this.options.invisibleCharacters) for (const t of ce.codePoints) xr(String.fromCodePoint(t)) || e.add(t);
			if (this.options.ambiguousCharacters) for (const t of this.ambiguousCharacters.getConfusableCodePoints()) e.add(t);
			for (const t of this.allowedCodePoints) e.delete(t);
			return e;
		}
		shouldHighlightNonBasicASCII(e, t) {
			const n = e.codePointAt(0);
			if (this.allowedCodePoints.has(n)) return 0;
			if (this.options.nonBasicASCII) return 1;
			let r = !1, i = !1;
			if (t) for (const s of t) {
				const e = s.codePointAt(0), t = le(s);
				r = r || t, t || this.ambiguousCharacters.isAmbiguous(e) || ce.isInvisibleCharacter(e) || (i = !0);
			}
			return !r && i ? 0 : this.options.invisibleCharacters && !xr(e) && ce.isInvisibleCharacter(n) ? 2 : this.options.ambiguousCharacters && this.ambiguousCharacters.isAmbiguous(n) ? 3 : 0;
		}
	};
	function xr(e) {
		return " " === e || "\n" === e || "	" === e;
	}
	var Er, Ar = class {
		constructor(e, t, n) {
			this.changes = e, this.moves = t, this.hitTimeout = n;
		}
	}, kr = class {
		constructor(e, t) {
			this.lineRangeMapping = e, this.changes = t;
		}
	};
	function Rr(e, t) {
		return (n, r) => t(e(n), e(r));
	}
	(function(e) {
		e.isLessThan = function(e) {
			return e < 0;
		}, e.isLessThanOrEqual = function(e) {
			return e <= 0;
		}, e.isGreaterThan = function(e) {
			return e > 0;
		}, e.isNeitherLessOrGreaterThan = function(e) {
			return 0 === e;
		}, e.greaterThan = 1, e.lessThan = -1, e.neitherLessOrGreaterThan = 0;
	})(Er || (Er = {}));
	const Tr = (e, t) => e - t;
	(class e {
		static {
			this.empty = new e((e) => {});
		}
		constructor(e) {
			this.iterate = e;
		}
		toArray() {
			const e = [];
			return this.iterate((t) => (e.push(t), !0)), e;
		}
		filter(t) {
			return new e((e) => this.iterate((n) => !t(n) || e(n)));
		}
		map(t) {
			return new e((e) => this.iterate((n) => e(t(n))));
		}
		findLast(e) {
			let t;
			return this.iterate((n) => (e(n) && (t = n), !0)), t;
		}
		findLastMaxBy(e) {
			let t, n = !0;
			return this.iterate((r) => ((n || Er.isGreaterThan(e(r, t))) && (n = !1, t = r), !0)), t;
		}
	});
	var Mr = class e {
		static fromTo(t, n) {
			return new e(t, n);
		}
		static addRange(t, n) {
			let r = 0;
			for (; r < n.length && n[r].endExclusive < t.start;) r++;
			let i = r;
			for (; i < n.length && n[i].start <= t.endExclusive;) i++;
			if (r === i) n.splice(r, 0, t);
			else {
				const s = Math.min(t.start, n[r].start), o = Math.max(t.endExclusive, n[i - 1].endExclusive);
				n.splice(r, i - r, new e(s, o));
			}
		}
		static tryCreate(t, n) {
			if (!(t > n)) return new e(t, n);
		}
		static ofLength(t) {
			return new e(0, t);
		}
		static ofStartAndLength(t, n) {
			return new e(t, t + n);
		}
		static emptyAt(t) {
			return new e(t, t);
		}
		constructor(e, t) {
			if (this.start = e, this.endExclusive = t, e > t) throw new o(`Invalid range: ${this.toString()}`);
		}
		get isEmpty() {
			return this.start === this.endExclusive;
		}
		delta(t) {
			return new e(this.start + t, this.endExclusive + t);
		}
		deltaStart(t) {
			return new e(this.start + t, this.endExclusive);
		}
		deltaEnd(t) {
			return new e(this.start, this.endExclusive + t);
		}
		get length() {
			return this.endExclusive - this.start;
		}
		toString() {
			return `[${this.start}, ${this.endExclusive})`;
		}
		equals(e) {
			return this.start === e.start && this.endExclusive === e.endExclusive;
		}
		contains(e) {
			return this.start <= e && e < this.endExclusive;
		}
		join(t) {
			return new e(Math.min(this.start, t.start), Math.max(this.endExclusive, t.endExclusive));
		}
		intersect(t) {
			const n = Math.max(this.start, t.start), r = Math.min(this.endExclusive, t.endExclusive);
			if (n <= r) return new e(n, r);
		}
		intersectionLength(e) {
			const t = Math.max(this.start, e.start), n = Math.min(this.endExclusive, e.endExclusive);
			return Math.max(0, n - t);
		}
		intersects(e) {
			return Math.max(this.start, e.start) < Math.min(this.endExclusive, e.endExclusive);
		}
		intersectsOrTouches(e) {
			return Math.max(this.start, e.start) <= Math.min(this.endExclusive, e.endExclusive);
		}
		isBefore(e) {
			return this.endExclusive <= e.start;
		}
		isAfter(e) {
			return this.start >= e.endExclusive;
		}
		slice(e) {
			return e.slice(this.start, this.endExclusive);
		}
		substring(e) {
			return e.substring(this.start, this.endExclusive);
		}
		clip(e) {
			if (this.isEmpty) throw new o(`Invalid clipping range: ${this.toString()}`);
			return Math.max(this.start, Math.min(this.endExclusive - 1, e));
		}
		clipCyclic(e) {
			if (this.isEmpty) throw new o(`Invalid clipping range: ${this.toString()}`);
			return e < this.start ? this.endExclusive - (this.start - e) % this.length : e >= this.endExclusive ? this.start + (e - this.start) % this.length : e;
		}
		forEach(e) {
			for (let t = this.start; t < this.endExclusive; t++) e(t);
		}
		joinRightTouching(t) {
			if (this.endExclusive !== t.start) throw new o(`Invalid join: ${this.toString()} and ${t.toString()}`);
			return new e(this.start, t.endExclusive);
		}
	};
	function Or(e, t) {
		const n = Ir(e, t);
		return -1 === n ? void 0 : e[n];
	}
	function Ir(e, t, n = 0, r = e.length) {
		let i = n, s = r;
		for (; i < s;) {
			const n = Math.floor((i + s) / 2);
			t(e[n]) ? i = n + 1 : s = n;
		}
		return i - 1;
	}
	function Pr(e, t, n = 0, r = e.length) {
		let i = n, s = r;
		for (; i < s;) {
			const n = Math.floor((i + s) / 2);
			t(e[n]) ? s = n : i = n + 1;
		}
		return i;
	}
	var Vr = class e {
		static {
			this.assertInvariants = !1;
		}
		constructor(e) {
			this._array = e, this._findLastMonotonousLastIdx = 0;
		}
		findLastMonotonous(t) {
			if (e.assertInvariants) {
				if (this._prevFindLastPredicate) {
					for (const e of this._array) if (this._prevFindLastPredicate(e) && !t(e)) throw new Error("MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.");
				}
				this._prevFindLastPredicate = t;
			}
			const n = Ir(this._array, t, this._findLastMonotonousLastIdx);
			return this._findLastMonotonousLastIdx = n + 1, -1 === n ? void 0 : this._array[n];
		}
	}, Fr = class e {
		static ofLength(t, n) {
			return new e(t, t + n);
		}
		static fromRange(t) {
			return new e(t.startLineNumber, t.endLineNumber);
		}
		static fromRangeInclusive(t) {
			return new e(t.startLineNumber, t.endLineNumber + 1);
		}
		static {
			this.compareByStart = Rr((e) => e.startLineNumber, Tr);
		}
		static joinMany(e) {
			if (0 === e.length) return [];
			let t = new Dr(e[0].slice());
			for (let n = 1; n < e.length; n++) t = t.getUnion(new Dr(e[n].slice()));
			return t.ranges;
		}
		static join(t) {
			if (0 === t.length) throw new o("lineRanges cannot be empty");
			let n = t[0].startLineNumber, r = t[0].endLineNumberExclusive;
			for (let e = 1; e < t.length; e++) n = Math.min(n, t[e].startLineNumber), r = Math.max(r, t[e].endLineNumberExclusive);
			return new e(n, r);
		}
		static deserialize(t) {
			return new e(t[0], t[1]);
		}
		constructor(e, t) {
			if (e > t) throw new o(`startLineNumber ${e} cannot be after endLineNumberExclusive ${t}`);
			this.startLineNumber = e, this.endLineNumberExclusive = t;
		}
		contains(e) {
			return this.startLineNumber <= e && e < this.endLineNumberExclusive;
		}
		get isEmpty() {
			return this.startLineNumber === this.endLineNumberExclusive;
		}
		delta(t) {
			return new e(this.startLineNumber + t, this.endLineNumberExclusive + t);
		}
		deltaLength(t) {
			return new e(this.startLineNumber, this.endLineNumberExclusive + t);
		}
		get length() {
			return this.endLineNumberExclusive - this.startLineNumber;
		}
		join(t) {
			return new e(Math.min(this.startLineNumber, t.startLineNumber), Math.max(this.endLineNumberExclusive, t.endLineNumberExclusive));
		}
		toString() {
			return `[${this.startLineNumber},${this.endLineNumberExclusive})`;
		}
		intersect(t) {
			const n = Math.max(this.startLineNumber, t.startLineNumber), r = Math.min(this.endLineNumberExclusive, t.endLineNumberExclusive);
			if (n <= r) return new e(n, r);
		}
		intersectsStrict(e) {
			return this.startLineNumber < e.endLineNumberExclusive && e.startLineNumber < this.endLineNumberExclusive;
		}
		intersectsOrTouches(e) {
			return this.startLineNumber <= e.endLineNumberExclusive && e.startLineNumber <= this.endLineNumberExclusive;
		}
		equals(e) {
			return this.startLineNumber === e.startLineNumber && this.endLineNumberExclusive === e.endLineNumberExclusive;
		}
		toInclusiveRange() {
			return this.isEmpty ? null : new De(this.startLineNumber, 1, this.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER);
		}
		toExclusiveRange() {
			return new De(this.startLineNumber, 1, this.endLineNumberExclusive, 1);
		}
		mapToLineArray(e) {
			const t = [];
			for (let n = this.startLineNumber; n < this.endLineNumberExclusive; n++) t.push(e(n));
			return t;
		}
		forEach(e) {
			for (let t = this.startLineNumber; t < this.endLineNumberExclusive; t++) e(t);
		}
		serialize() {
			return [this.startLineNumber, this.endLineNumberExclusive];
		}
		toOffsetRange() {
			return new Mr(this.startLineNumber - 1, this.endLineNumberExclusive - 1);
		}
		addMargin(t, n) {
			return new e(this.startLineNumber - t, this.endLineNumberExclusive + n);
		}
	}, Dr = class e {
		constructor(e = []) {
			this._normalizedRanges = e;
		}
		get ranges() {
			return this._normalizedRanges;
		}
		addRange(e) {
			if (0 === e.length) return;
			const t = Pr(this._normalizedRanges, (t) => t.endLineNumberExclusive >= e.startLineNumber), n = Ir(this._normalizedRanges, (t) => t.startLineNumber <= e.endLineNumberExclusive) + 1;
			if (t === n) this._normalizedRanges.splice(t, 0, e);
			else if (t === n - 1) {
				const n = this._normalizedRanges[t];
				this._normalizedRanges[t] = n.join(e);
			} else {
				const r = this._normalizedRanges[t].join(this._normalizedRanges[n - 1]).join(e);
				this._normalizedRanges.splice(t, n - t, r);
			}
		}
		contains(e) {
			const t = Or(this._normalizedRanges, (t) => t.startLineNumber <= e);
			return !!t && t.endLineNumberExclusive > e;
		}
		intersects(e) {
			const t = Or(this._normalizedRanges, (t) => t.startLineNumber < e.endLineNumberExclusive);
			return !!t && t.endLineNumberExclusive > e.startLineNumber;
		}
		getUnion(t) {
			if (0 === this._normalizedRanges.length) return t;
			if (0 === t._normalizedRanges.length) return this;
			const n = [];
			let r = 0, i = 0, s = null;
			for (; r < this._normalizedRanges.length || i < t._normalizedRanges.length;) {
				let e = null;
				if (r < this._normalizedRanges.length && i < t._normalizedRanges.length) {
					const n = this._normalizedRanges[r], s = t._normalizedRanges[i];
					n.startLineNumber < s.startLineNumber ? (e = n, r++) : (e = s, i++);
				} else r < this._normalizedRanges.length ? (e = this._normalizedRanges[r], r++) : (e = t._normalizedRanges[i], i++);
				null === s ? s = e : s.endLineNumberExclusive >= e.startLineNumber ? s = new Fr(s.startLineNumber, Math.max(s.endLineNumberExclusive, e.endLineNumberExclusive)) : (n.push(s), s = e);
			}
			return null !== s && n.push(s), new e(n);
		}
		subtractFrom(t) {
			const n = Pr(this._normalizedRanges, (e) => e.endLineNumberExclusive >= t.startLineNumber), r = Ir(this._normalizedRanges, (e) => e.startLineNumber <= t.endLineNumberExclusive) + 1;
			if (n === r) return new e([t]);
			const i = [];
			let s = t.startLineNumber;
			for (let e = n; e < r; e++) {
				const t = this._normalizedRanges[e];
				t.startLineNumber > s && i.push(new Fr(s, t.startLineNumber)), s = t.endLineNumberExclusive;
			}
			return s < t.endLineNumberExclusive && i.push(new Fr(s, t.endLineNumberExclusive)), new e(i);
		}
		toString() {
			return this._normalizedRanges.map((e) => e.toString()).join(", ");
		}
		getIntersection(t) {
			const n = [];
			let r = 0, i = 0;
			for (; r < this._normalizedRanges.length && i < t._normalizedRanges.length;) {
				const e = this._normalizedRanges[r], s = t._normalizedRanges[i], o = e.intersect(s);
				o && !o.isEmpty && n.push(o), e.endLineNumberExclusive < s.endLineNumberExclusive ? r++ : i++;
			}
			return new e(n);
		}
		getWithDelta(t) {
			return new e(this._normalizedRanges.map((e) => e.delta(t)));
		}
	}, qr = class e {
		static {
			this.zero = new e(0, 0);
		}
		static betweenPositions(t, n) {
			return t.lineNumber === n.lineNumber ? new e(0, n.column - t.column) : new e(n.lineNumber - t.lineNumber, n.column - 1);
		}
		static fromPosition(t) {
			return new e(t.lineNumber - 1, t.column - 1);
		}
		static ofRange(t) {
			return e.betweenPositions(t.getStartPosition(), t.getEndPosition());
		}
		static ofText(t) {
			let n = 0, r = 0;
			for (const e of t) "\n" === e ? (n++, r = 0) : r++;
			return new e(n, r);
		}
		constructor(e, t) {
			this.lineCount = e, this.columnCount = t;
		}
		isGreaterThanOrEqualTo(e) {
			return this.lineCount !== e.lineCount ? this.lineCount > e.lineCount : this.columnCount >= e.columnCount;
		}
		add(t) {
			return 0 === t.lineCount ? new e(this.lineCount, this.columnCount + t.columnCount) : new e(this.lineCount + t.lineCount, t.columnCount);
		}
		createRange(e) {
			return 0 === this.lineCount ? new De(e.lineNumber, e.column, e.lineNumber, e.column + this.columnCount) : new De(e.lineNumber, e.column, e.lineNumber + this.lineCount, this.columnCount + 1);
		}
		toRange() {
			return new De(1, 1, this.lineCount + 1, this.columnCount + 1);
		}
		toLineRange() {
			return Fr.ofLength(1, this.lineCount + 1);
		}
		addToPosition(e) {
			return 0 === this.lineCount ? new Fe(e.lineNumber, e.column + this.columnCount) : new Fe(e.lineNumber + this.lineCount, this.columnCount + 1);
		}
		toString() {
			return `${this.lineCount},${this.columnCount}`;
		}
	}, Kr = class {
		getOffsetRange(e) {
			return new Mr(this.getOffset(e.getStartPosition()), this.getOffset(e.getEndPosition()));
		}
		getRange(e) {
			return De.fromPositions(this.getPosition(e.start), this.getPosition(e.endExclusive));
		}
		getStringReplacement(e) {
			return new Br.deps.StringReplacement(this.getOffsetRange(e.range), e.text);
		}
		getTextReplacement(e) {
			return new Br.deps.TextReplacement(this.getRange(e.replaceRange), e.newText);
		}
		getTextEdit(e) {
			const t = e.replacements.map((e) => this.getTextReplacement(e));
			return new Br.deps.TextEdit(t);
		}
	}, Br = class {
		static {
			this._deps = void 0;
		}
		static get deps() {
			if (!this._deps) throw new Error("Dependencies not set. Call _setDependencies first.");
			return this._deps;
		}
	}, $r = class extends Kr {
		constructor(e) {
			super(), this.text = e, this.lineStartOffsetByLineIdx = [], this.lineEndOffsetByLineIdx = [], this.lineStartOffsetByLineIdx.push(0);
			for (let t = 0; t < e.length; t++) "\n" === e.charAt(t) && (this.lineStartOffsetByLineIdx.push(t + 1), t > 0 && "\r" === e.charAt(t - 1) ? this.lineEndOffsetByLineIdx.push(t - 1) : this.lineEndOffsetByLineIdx.push(t));
			this.lineEndOffsetByLineIdx.push(e.length);
		}
		getOffset(e) {
			const t = this._validatePosition(e);
			return this.lineStartOffsetByLineIdx[t.lineNumber - 1] + t.column - 1;
		}
		_validatePosition(e) {
			if (e.lineNumber < 1) return new Fe(1, 1);
			const t = this.textLength.lineCount + 1;
			if (e.lineNumber > t) return new Fe(t, this.getLineLength(t) + 1);
			if (e.column < 1) return new Fe(e.lineNumber, 1);
			const n = this.getLineLength(e.lineNumber);
			return e.column - 1 > n ? new Fe(e.lineNumber, n + 1) : e;
		}
		getPosition(e) {
			const t = Ir(this.lineStartOffsetByLineIdx, (t) => t <= e);
			return new Fe(t + 1, e - this.lineStartOffsetByLineIdx[t] + 1);
		}
		get textLength() {
			const e = this.lineStartOffsetByLineIdx.length - 1;
			return new Br.deps.TextLength(e, this.text.length - this.lineStartOffsetByLineIdx[e]);
		}
		getLineLength(e) {
			return this.lineEndOffsetByLineIdx[e - 1] - this.lineStartOffsetByLineIdx[e - 1];
		}
	}, Ur = class {
		constructor() {
			this._transformer = void 0;
		}
		get endPositionExclusive() {
			return this.length.addToPosition(new Fe(1, 1));
		}
		get lineRange() {
			return this.length.toLineRange();
		}
		getValue() {
			return this.getValueOfRange(this.length.toRange());
		}
		getValueOfOffsetRange(e) {
			return this.getValueOfRange(this.getTransformer().getRange(e));
		}
		getLineLength(e) {
			return this.getValueOfRange(new De(e, 1, e, Number.MAX_SAFE_INTEGER)).length;
		}
		getTransformer() {
			return this._transformer || (this._transformer = new $r(this.getValue())), this._transformer;
		}
		getLineAt(e) {
			return this.getValueOfRange(new De(e, 1, e, Number.MAX_SAFE_INTEGER));
		}
	}, jr = class extends Ur {
		constructor(e, t) {
			(function(e, t = "unexpected state") {
				if (!e) throw "string" == typeof t ? new o(`Assertion Failed: ${t}`) : t;
			})(t >= 1), super(), this._getLineContent = e, this._lineCount = t;
		}
		getValueOfRange(e) {
			if (e.startLineNumber === e.endLineNumber) return this._getLineContent(e.startLineNumber).substring(e.startColumn - 1, e.endColumn - 1);
			let t = this._getLineContent(e.startLineNumber).substring(e.startColumn - 1);
			for (let n = e.startLineNumber + 1; n < e.endLineNumber; n++) t += "\n" + this._getLineContent(n);
			return t += "\n" + this._getLineContent(e.endLineNumber).substring(0, e.endColumn - 1), t;
		}
		getLineLength(e) {
			return this._getLineContent(e).length;
		}
		get length() {
			const e = this._getLineContent(this._lineCount);
			return new qr(this._lineCount - 1, e.length);
		}
	}, Wr = class extends jr {
		constructor(e) {
			super((t) => e[t - 1], e.length);
		}
	}, zr = class e {
		static joinReplacements(t, n) {
			if (0 === t.length) throw new o();
			if (1 === t.length) return t[0];
			const r = t[0].range.getStartPosition(), i = t[t.length - 1].range.getEndPosition();
			let s = "";
			for (let e = 0; e < t.length; e++) {
				const r = t[e];
				if (s += r.text, e < t.length - 1) {
					const i = t[e + 1], o = De.fromPositions(r.range.getEndPosition(), i.range.getStartPosition());
					s += n.getValueOfRange(o);
				}
			}
			return new e(De.fromPositions(r, i), s);
		}
		static fromStringReplacement(t, n) {
			return new e(n.getTransformer().getRange(t.replaceRange), t.newText);
		}
		static delete(t) {
			return new e(t, "");
		}
		constructor(e, t) {
			this.range = e, this.text = t;
		}
		get isEmpty() {
			return this.range.isEmpty() && 0 === this.text.length;
		}
		static equals(e, t) {
			return e.range.equalsRange(t.range) && e.text === t.text;
		}
		equals(t) {
			return e.equals(this, t);
		}
		removeCommonPrefixAndSuffix(e) {
			return this.removeCommonPrefix(e).removeCommonSuffix(e);
		}
		removeCommonPrefix(t) {
			const n = t.getValueOfRange(this.range).replaceAll("\r\n", "\n"), r = this.text.replaceAll("\r\n", "\n"), i = function(e, t) {
				const n = Math.min(e.length, t.length);
				let r;
				for (r = 0; r < n; r++) if (e.charCodeAt(r) !== t.charCodeAt(r)) return r;
				return n;
			}(n, r), s = qr.ofText(n.substring(0, i)).addToPosition(this.range.getStartPosition()), o = r.substring(i);
			return new e(De.fromPositions(s, this.range.getEndPosition()), o);
		}
		removeCommonSuffix(t) {
			const n = t.getValueOfRange(this.range).replaceAll("\r\n", "\n"), r = this.text.replaceAll("\r\n", "\n"), i = function(e, t) {
				const n = Math.min(e.length, t.length);
				let r;
				const i = e.length - 1, s = t.length - 1;
				for (r = 0; r < n; r++) if (e.charCodeAt(i - r) !== t.charCodeAt(s - r)) return r;
				return n;
			}(n, r), s = qr.ofText(n.substring(0, n.length - i)).addToPosition(this.range.getStartPosition()), o = r.substring(0, r.length - i);
			return new e(De.fromPositions(this.range.getStartPosition(), s), o);
		}
		toString() {
			const e = this.range.getStartPosition(), t = this.range.getEndPosition();
			return `(${e.lineNumber},${e.column} -> ${t.lineNumber},${t.column}): "${this.text}"`;
		}
	}, Hr = class e {
		static inverse(t, n, r) {
			const i = [];
			let s = 1, o = 1;
			for (const l of t) {
				const t = new e(new Fr(s, l.original.startLineNumber), new Fr(o, l.modified.startLineNumber));
				t.modified.isEmpty || i.push(t), s = l.original.endLineNumberExclusive, o = l.modified.endLineNumberExclusive;
			}
			const a = new e(new Fr(s, n + 1), new Fr(o, r + 1));
			return a.modified.isEmpty || i.push(a), i;
		}
		static clip(t, n, r) {
			const i = [];
			for (const s of t) {
				const t = s.original.intersect(n), o = s.modified.intersect(r);
				t && !t.isEmpty && o && !o.isEmpty && i.push(new e(t, o));
			}
			return i;
		}
		constructor(e, t) {
			this.original = e, this.modified = t;
		}
		toString() {
			return `{${this.original.toString()}->${this.modified.toString()}}`;
		}
		flip() {
			return new e(this.modified, this.original);
		}
		join(t) {
			return new e(this.original.join(t.original), this.modified.join(t.modified));
		}
		toRangeMapping() {
			const e = this.original.toInclusiveRange(), t = this.modified.toInclusiveRange();
			if (e && t) return new Qr(e, t);
			if (1 === this.original.startLineNumber || 1 === this.modified.startLineNumber) {
				if (1 !== this.modified.startLineNumber || 1 !== this.original.startLineNumber) throw new o("not a valid diff");
				return new Qr(new De(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new De(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
			}
			return new Qr(new De(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), new De(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER));
		}
		toRangeMapping2(e, t) {
			if (Jr(this.original.endLineNumberExclusive, e) && Jr(this.modified.endLineNumberExclusive, t)) return new Qr(new De(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new De(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
			if (!this.original.isEmpty && !this.modified.isEmpty) return new Qr(De.fromPositions(new Fe(this.original.startLineNumber, 1), Gr(new Fe(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), e)), De.fromPositions(new Fe(this.modified.startLineNumber, 1), Gr(new Fe(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), t)));
			if (this.original.startLineNumber > 1 && this.modified.startLineNumber > 1) return new Qr(De.fromPositions(Gr(new Fe(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER), e), Gr(new Fe(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), e)), De.fromPositions(Gr(new Fe(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER), t), Gr(new Fe(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), t)));
			throw new o();
		}
	};
	function Gr(e, t) {
		if (e.lineNumber < 1) return new Fe(1, 1);
		if (e.lineNumber > t.length) return new Fe(t.length, t[t.length - 1].length + 1);
		const n = t[e.lineNumber - 1];
		return e.column > n.length + 1 ? new Fe(e.lineNumber, n.length + 1) : e;
	}
	function Jr(e, t) {
		return e >= 1 && e <= t.length;
	}
	var Xr = class e extends Hr {
		static fromRangeMappings(t) {
			return new e(Fr.join(t.map((e) => Fr.fromRangeInclusive(e.originalRange))), Fr.join(t.map((e) => Fr.fromRangeInclusive(e.modifiedRange))), t);
		}
		constructor(e, t, n) {
			super(e, t), this.innerChanges = n;
		}
		flip() {
			return new e(this.modified, this.original, this.innerChanges?.map((e) => e.flip()));
		}
		withInnerChangesFromLineRanges() {
			return new e(this.original, this.modified, [this.toRangeMapping()]);
		}
	}, Qr = class e {
		static fromEdit(t) {
			const n = t.getNewRanges();
			return t.replacements.map((t, r) => new e(t.range, n[r]));
		}
		static assertSorted(e) {
			for (let t = 1; t < e.length; t++) {
				const n = e[t - 1], r = e[t];
				if (!n.originalRange.getEndPosition().isBeforeOrEqual(r.originalRange.getStartPosition()) || !n.modifiedRange.getEndPosition().isBeforeOrEqual(r.modifiedRange.getStartPosition())) throw new o("Range mappings must be sorted");
			}
		}
		constructor(e, t) {
			this.originalRange = e, this.modifiedRange = t;
		}
		toString() {
			return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
		}
		flip() {
			return new e(this.modifiedRange, this.originalRange);
		}
		toTextEdit(e) {
			const t = e.getValueOfRange(this.modifiedRange);
			return new zr(this.originalRange, t);
		}
	};
	function Zr(e, t, n, r = !1) {
		const i = [];
		for (const s of function* (e, t) {
			let n, r;
			for (const i of e) void 0 !== r && t(r, i) ? n.push(i) : (n && (yield n), n = [i]), r = i;
			n && (yield n);
		}(e.map((e) => function(e, t, n) {
			let r = 0, i = 0;
			1 === e.modifiedRange.endColumn && 1 === e.originalRange.endColumn && e.originalRange.startLineNumber + r <= e.originalRange.endLineNumber && e.modifiedRange.startLineNumber + r <= e.modifiedRange.endLineNumber && (i = -1);
			e.modifiedRange.startColumn - 1 >= n.getLineLength(e.modifiedRange.startLineNumber) && e.originalRange.startColumn - 1 >= t.getLineLength(e.originalRange.startLineNumber) && e.originalRange.startLineNumber <= e.originalRange.endLineNumber + i && e.modifiedRange.startLineNumber <= e.modifiedRange.endLineNumber + i && (r = 1);
			return new Xr(new Fr(e.originalRange.startLineNumber + r, e.originalRange.endLineNumber + 1 + i), new Fr(e.modifiedRange.startLineNumber + r, e.modifiedRange.endLineNumber + 1 + i), [e]);
		}(e, t, n)), (e, t) => e.original.intersectsOrTouches(t.original) || e.modified.intersectsOrTouches(t.modified))) {
			const e = s[0], t = s[s.length - 1];
			i.push(new Xr(e.original.join(t.original), e.modified.join(t.modified), s.map((e) => e.innerChanges[0])));
		}
		return l(() => {
			if (!r && i.length > 0) {
				if (i[0].modified.startLineNumber !== i[0].original.startLineNumber) return !1;
				if (n.length.lineCount - i[i.length - 1].modified.endLineNumberExclusive !== t.length.lineCount - i[i.length - 1].original.endLineNumberExclusive) return !1;
			}
			return u(i, (e, t) => t.original.startLineNumber - e.original.endLineNumberExclusive === t.modified.startLineNumber - e.modified.endLineNumberExclusive && e.original.endLineNumberExclusive < t.original.startLineNumber && e.modified.endLineNumberExclusive < t.modified.startLineNumber);
		}), i;
	}
	var Yr = class {
		computeDiff(e, t, n) {
			const r = new si(e, t, {
				maxComputationTime: n.maxComputationTimeMs,
				shouldIgnoreTrimWhitespace: n.ignoreTrimWhitespace,
				shouldComputeCharChanges: !0,
				shouldMakePrettyDiff: !0,
				shouldPostProcessCharChanges: !0
			}).computeDiff(), i = [];
			let s = null;
			for (const o of r.changes) {
				let e, t;
				e = 0 === o.originalEndLineNumber ? new Fr(o.originalStartLineNumber + 1, o.originalStartLineNumber + 1) : new Fr(o.originalStartLineNumber, o.originalEndLineNumber + 1), t = 0 === o.modifiedEndLineNumber ? new Fr(o.modifiedStartLineNumber + 1, o.modifiedStartLineNumber + 1) : new Fr(o.modifiedStartLineNumber, o.modifiedEndLineNumber + 1);
				let n = new Xr(e, t, o.charChanges?.map((e) => new Qr(new De(e.originalStartLineNumber, e.originalStartColumn, e.originalEndLineNumber, e.originalEndColumn), new De(e.modifiedStartLineNumber, e.modifiedStartColumn, e.modifiedEndLineNumber, e.modifiedEndColumn))));
				s && (s.modified.endLineNumberExclusive !== n.modified.startLineNumber && s.original.endLineNumberExclusive !== n.original.startLineNumber || (n = new Xr(s.original.join(n.original), s.modified.join(n.modified), s.innerChanges && n.innerChanges ? s.innerChanges.concat(n.innerChanges) : void 0), i.pop())), i.push(n), s = n;
			}
			return l(() => u(i, (e, t) => t.original.startLineNumber - e.original.endLineNumberExclusive === t.modified.startLineNumber - e.modified.endLineNumberExclusive && e.original.endLineNumberExclusive < t.original.startLineNumber && e.modified.endLineNumberExclusive < t.modified.startLineNumber)), new Ar(i, [], r.quitEarly);
		}
	};
	function ei(e, t, n, r) {
		return new Ve(e, t, n).ComputeDiff(r);
	}
	var ti = class {
		constructor(e) {
			const t = [], n = [];
			for (let r = 0, i = e.length; r < i; r++) t[r] = oi(e[r], 1), n[r] = ai(e[r], 1);
			this.lines = e, this._startColumns = t, this._endColumns = n;
		}
		getElements() {
			const e = [];
			for (let t = 0, n = this.lines.length; t < n; t++) e[t] = this.lines[t].substring(this._startColumns[t] - 1, this._endColumns[t] - 1);
			return e;
		}
		getStrictElement(e) {
			return this.lines[e];
		}
		getStartLineNumber(e) {
			return e + 1;
		}
		getEndLineNumber(e) {
			return e + 1;
		}
		createCharSequence(e, t, n) {
			const r = [], i = [], s = [];
			let o = 0;
			for (let a = t; a <= n; a++) {
				const t = this.lines[a], l = e ? this._startColumns[a] : 1, u = e ? this._endColumns[a] : t.length + 1;
				for (let e = l; e < u; e++) r[o] = t.charCodeAt(e - 1), i[o] = a + 1, s[o] = e, o++;
				!e && a < n && (r[o] = 10, i[o] = a + 1, s[o] = t.length + 1, o++);
			}
			return new ni(r, i, s);
		}
	}, ni = class {
		constructor(e, t, n) {
			this._charCodes = e, this._lineNumbers = t, this._columns = n;
		}
		toString() {
			return "[" + this._charCodes.map((e, t) => (10 === e ? "\\n" : String.fromCharCode(e)) + `-(${this._lineNumbers[t]},${this._columns[t]})`).join(", ") + "]";
		}
		_assertIndex(e, t) {
			if (e < 0 || e >= t.length) throw new Error("Illegal index");
		}
		getElements() {
			return this._charCodes;
		}
		getStartLineNumber(e) {
			return e > 0 && e === this._lineNumbers.length ? this.getEndLineNumber(e - 1) : (this._assertIndex(e, this._lineNumbers), this._lineNumbers[e]);
		}
		getEndLineNumber(e) {
			return -1 === e ? this.getStartLineNumber(e + 1) : (this._assertIndex(e, this._lineNumbers), 10 === this._charCodes[e] ? this._lineNumbers[e] + 1 : this._lineNumbers[e]);
		}
		getStartColumn(e) {
			return e > 0 && e === this._columns.length ? this.getEndColumn(e - 1) : (this._assertIndex(e, this._columns), this._columns[e]);
		}
		getEndColumn(e) {
			return -1 === e ? this.getStartColumn(e + 1) : (this._assertIndex(e, this._columns), 10 === this._charCodes[e] ? 1 : this._columns[e] + 1);
		}
	}, ri = class e {
		constructor(e, t, n, r, i, s, o, a) {
			this.originalStartLineNumber = e, this.originalStartColumn = t, this.originalEndLineNumber = n, this.originalEndColumn = r, this.modifiedStartLineNumber = i, this.modifiedStartColumn = s, this.modifiedEndLineNumber = o, this.modifiedEndColumn = a;
		}
		static createFromDiffChange(t, n, r) {
			return new e(n.getStartLineNumber(t.originalStart), n.getStartColumn(t.originalStart), n.getEndLineNumber(t.originalStart + t.originalLength - 1), n.getEndColumn(t.originalStart + t.originalLength - 1), r.getStartLineNumber(t.modifiedStart), r.getStartColumn(t.modifiedStart), r.getEndLineNumber(t.modifiedStart + t.modifiedLength - 1), r.getEndColumn(t.modifiedStart + t.modifiedLength - 1));
		}
	};
	var ii = class e {
		constructor(e, t, n, r, i) {
			this.originalStartLineNumber = e, this.originalEndLineNumber = t, this.modifiedStartLineNumber = n, this.modifiedEndLineNumber = r, this.charChanges = i;
		}
		static createFromDiffResult(t, n, r, i, s, o, a) {
			let l, u, c, h, d;
			if (0 === n.originalLength ? (l = r.getStartLineNumber(n.originalStart) - 1, u = 0) : (l = r.getStartLineNumber(n.originalStart), u = r.getEndLineNumber(n.originalStart + n.originalLength - 1)), 0 === n.modifiedLength ? (c = i.getStartLineNumber(n.modifiedStart) - 1, h = 0) : (c = i.getStartLineNumber(n.modifiedStart), h = i.getEndLineNumber(n.modifiedStart + n.modifiedLength - 1)), o && n.originalLength > 0 && n.originalLength < 20 && n.modifiedLength > 0 && n.modifiedLength < 20 && s()) {
				const e = r.createCharSequence(t, n.originalStart, n.originalStart + n.originalLength - 1), o = i.createCharSequence(t, n.modifiedStart, n.modifiedStart + n.modifiedLength - 1);
				if (e.getElements().length > 0 && o.getElements().length > 0) {
					let t = ei(e, o, s, !0).changes;
					a && (t = function(e) {
						if (e.length <= 1) return e;
						const t = [e[0]];
						let n = t[0];
						for (let r = 1, i = e.length; r < i; r++) {
							const i = e[r], s = i.originalStart - (n.originalStart + n.originalLength), o = i.modifiedStart - (n.modifiedStart + n.modifiedLength);
							Math.min(s, o) < 3 ? (n.originalLength = i.originalStart + i.originalLength - n.originalStart, n.modifiedLength = i.modifiedStart + i.modifiedLength - n.modifiedStart) : (t.push(i), n = i);
						}
						return t;
					}(t)), d = [];
					for (let n = 0, r = t.length; n < r; n++) d.push(ri.createFromDiffChange(t[n], e, o));
				}
			}
			return new e(l, u, c, h, d);
		}
	}, si = class {
		constructor(e, t, n) {
			this.shouldComputeCharChanges = n.shouldComputeCharChanges, this.shouldPostProcessCharChanges = n.shouldPostProcessCharChanges, this.shouldIgnoreTrimWhitespace = n.shouldIgnoreTrimWhitespace, this.shouldMakePrettyDiff = n.shouldMakePrettyDiff, this.originalLines = e, this.modifiedLines = t, this.original = new ti(e), this.modified = new ti(t), this.continueLineDiff = li(n.maxComputationTime), this.continueCharDiff = li(0 === n.maxComputationTime ? 0 : Math.min(n.maxComputationTime, 5e3));
		}
		computeDiff() {
			if (1 === this.original.lines.length && 0 === this.original.lines[0].length) return 1 === this.modified.lines.length && 0 === this.modified.lines[0].length ? {
				quitEarly: !1,
				changes: []
			} : {
				quitEarly: !1,
				changes: [{
					originalStartLineNumber: 1,
					originalEndLineNumber: 1,
					modifiedStartLineNumber: 1,
					modifiedEndLineNumber: this.modified.lines.length,
					charChanges: void 0
				}]
			};
			if (1 === this.modified.lines.length && 0 === this.modified.lines[0].length) return {
				quitEarly: !1,
				changes: [{
					originalStartLineNumber: 1,
					originalEndLineNumber: this.original.lines.length,
					modifiedStartLineNumber: 1,
					modifiedEndLineNumber: 1,
					charChanges: void 0
				}]
			};
			const e = ei(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff), t = e.changes, n = e.quitEarly;
			if (this.shouldIgnoreTrimWhitespace) {
				const e = [];
				for (let n = 0, r = t.length; n < r; n++) e.push(ii.createFromDiffResult(this.shouldIgnoreTrimWhitespace, t[n], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
				return {
					quitEarly: n,
					changes: e
				};
			}
			const r = [];
			let i = 0, s = 0;
			for (let o = -1, a = t.length; o < a; o++) {
				const e = o + 1 < a ? t[o + 1] : null, n = e ? e.originalStart : this.originalLines.length, l = e ? e.modifiedStart : this.modifiedLines.length;
				for (; i < n && s < l;) {
					const e = this.originalLines[i], t = this.modifiedLines[s];
					if (e !== t) {
						{
							let n = oi(e, 1), o = oi(t, 1);
							for (; n > 1 && o > 1 && e.charCodeAt(n - 2) === t.charCodeAt(o - 2);) n--, o--;
							(n > 1 || o > 1) && this._pushTrimWhitespaceCharChange(r, i + 1, 1, n, s + 1, 1, o);
						}
						{
							let n = ai(e, 1), o = ai(t, 1);
							const a = e.length + 1, l = t.length + 1;
							for (; n < a && o < l && e.charCodeAt(n - 1) === e.charCodeAt(o - 1);) n++, o++;
							(n < a || o < l) && this._pushTrimWhitespaceCharChange(r, i + 1, n, a, s + 1, o, l);
						}
					}
					i++, s++;
				}
				e && (r.push(ii.createFromDiffResult(this.shouldIgnoreTrimWhitespace, e, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges)), i += e.originalLength, s += e.modifiedLength);
			}
			return {
				quitEarly: n,
				changes: r
			};
		}
		_pushTrimWhitespaceCharChange(e, t, n, r, i, s, o) {
			if (this._mergeTrimWhitespaceCharChange(e, t, n, r, i, s, o)) return;
			let a;
			this.shouldComputeCharChanges && (a = [new ri(t, n, t, r, i, s, i, o)]), e.push(new ii(t, t, i, i, a));
		}
		_mergeTrimWhitespaceCharChange(e, t, n, r, i, s, o) {
			const a = e.length;
			if (0 === a) return !1;
			const l = e[a - 1];
			return 0 !== l.originalEndLineNumber && 0 !== l.modifiedEndLineNumber && (l.originalEndLineNumber === t && l.modifiedEndLineNumber === i ? (this.shouldComputeCharChanges && l.charChanges && l.charChanges.push(new ri(t, n, t, r, i, s, i, o)), !0) : l.originalEndLineNumber + 1 === t && l.modifiedEndLineNumber + 1 === i && (l.originalEndLineNumber = t, l.modifiedEndLineNumber = i, this.shouldComputeCharChanges && l.charChanges && l.charChanges.push(new ri(t, n, t, r, i, s, i, o)), !0));
		}
	};
	function oi(e, t) {
		const n = function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				const n = e.charCodeAt(t);
				if (32 !== n && 9 !== n) return t;
			}
			return -1;
		}(e);
		return -1 === n ? t : n + 1;
	}
	function ai(e, t) {
		const n = function(e, t = e.length - 1) {
			for (let n = t; n >= 0; n--) {
				const t = e.charCodeAt(n);
				if (32 !== t && 9 !== t) return n;
			}
			return -1;
		}(e);
		return -1 === n ? t : n + 2;
	}
	function li(e) {
		if (0 === e) return () => !0;
		const t = Date.now();
		return () => Date.now() - t < e;
	}
	var ui = class e {
		static trivial(t, n) {
			return new e([new ci(Mr.ofLength(t.length), Mr.ofLength(n.length))], !1);
		}
		static trivialTimedOut(t, n) {
			return new e([new ci(Mr.ofLength(t.length), Mr.ofLength(n.length))], !0);
		}
		constructor(e, t) {
			this.diffs = e, this.hitTimeout = t;
		}
	}, ci = class e {
		static invert(t, n) {
			const r = [];
			return function(e, t) {
				for (let n = 0; n <= e.length; n++) t(0 === n ? void 0 : e[n - 1], n === e.length ? void 0 : e[n]);
			}(t, (t, i) => {
				r.push(e.fromOffsetPairs(t ? t.getEndExclusives() : hi.zero, i ? i.getStarts() : new hi(n, (t ? t.seq2Range.endExclusive - t.seq1Range.endExclusive : 0) + n)));
			}), r;
		}
		static fromOffsetPairs(t, n) {
			return new e(new Mr(t.offset1, n.offset1), new Mr(t.offset2, n.offset2));
		}
		static assertSorted(e) {
			let t;
			for (const n of e) {
				if (t && !(t.seq1Range.endExclusive <= n.seq1Range.start && t.seq2Range.endExclusive <= n.seq2Range.start)) throw new o("Sequence diffs must be sorted");
				t = n;
			}
		}
		constructor(e, t) {
			this.seq1Range = e, this.seq2Range = t;
		}
		swap() {
			return new e(this.seq2Range, this.seq1Range);
		}
		toString() {
			return `${this.seq1Range} <-> ${this.seq2Range}`;
		}
		join(t) {
			return new e(this.seq1Range.join(t.seq1Range), this.seq2Range.join(t.seq2Range));
		}
		delta(t) {
			return 0 === t ? this : new e(this.seq1Range.delta(t), this.seq2Range.delta(t));
		}
		deltaStart(t) {
			return 0 === t ? this : new e(this.seq1Range.deltaStart(t), this.seq2Range.deltaStart(t));
		}
		deltaEnd(t) {
			return 0 === t ? this : new e(this.seq1Range.deltaEnd(t), this.seq2Range.deltaEnd(t));
		}
		intersect(t) {
			const n = this.seq1Range.intersect(t.seq1Range), r = this.seq2Range.intersect(t.seq2Range);
			if (n && r) return new e(n, r);
		}
		getStarts() {
			return new hi(this.seq1Range.start, this.seq2Range.start);
		}
		getEndExclusives() {
			return new hi(this.seq1Range.endExclusive, this.seq2Range.endExclusive);
		}
	}, hi = class e {
		static {
			this.zero = new e(0, 0);
		}
		static {
			this.max = new e(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
		}
		constructor(e, t) {
			this.offset1 = e, this.offset2 = t;
		}
		toString() {
			return `${this.offset1} <-> ${this.offset2}`;
		}
		delta(t) {
			return 0 === t ? this : new e(this.offset1 + t, this.offset2 + t);
		}
		equals(e) {
			return this.offset1 === e.offset1 && this.offset2 === e.offset2;
		}
	}, di = class e {
		static {
			this.instance = new e();
		}
		isValid() {
			return !0;
		}
	}, fi = class {
		constructor(e) {
			if (this.timeout = e, this.startTime = Date.now(), this.valid = !0, e <= 0) throw new o("timeout must be positive");
		}
		isValid() {
			return Date.now() - this.startTime < this.timeout || !this.valid || (this.valid = !1), this.valid;
		}
	}, mi = class {
		constructor(e, t) {
			this.width = e, this.height = t, this.array = [], this.array = new Array(e * t);
		}
		get(e, t) {
			return this.array[e + t * this.width];
		}
		set(e, t, n) {
			this.array[e + t * this.width] = n;
		}
	};
	function gi(e) {
		return 32 === e || 9 === e;
	}
	var pi = class e {
		static {
			this.chrKeys = /* @__PURE__ */ new Map();
		}
		static getKey(e) {
			let t = this.chrKeys.get(e);
			return void 0 === t && (t = this.chrKeys.size, this.chrKeys.set(e, t)), t;
		}
		constructor(t, n, r) {
			this.range = t, this.lines = n, this.source = r, this.histogram = [];
			let i = 0;
			for (let s = t.startLineNumber - 1; s < t.endLineNumberExclusive - 1; s++) {
				const t = n[s];
				for (let n = 0; n < t.length; n++) {
					i++;
					const r = t[n], s = e.getKey(r);
					this.histogram[s] = (this.histogram[s] || 0) + 1;
				}
				i++;
				const r = e.getKey("\n");
				this.histogram[r] = (this.histogram[r] || 0) + 1;
			}
			this.totalCount = i;
		}
		computeSimilarity(e) {
			let t = 0;
			const n = Math.max(this.histogram.length, e.histogram.length);
			for (let r = 0; r < n; r++) t += Math.abs((this.histogram[r] ?? 0) - (e.histogram[r] ?? 0));
			return 1 - t / (this.totalCount + e.totalCount);
		}
	}, bi = class {
		compute(e, t, n = di.instance, r) {
			if (0 === e.length || 0 === t.length) return ui.trivial(e, t);
			const i = new mi(e.length, t.length), s = new mi(e.length, t.length), o = new mi(e.length, t.length);
			for (let f = 0; f < e.length; f++) for (let a = 0; a < t.length; a++) {
				if (!n.isValid()) return ui.trivialTimedOut(e, t);
				const l = 0 === f ? 0 : i.get(f - 1, a), u = 0 === a ? 0 : i.get(f, a - 1);
				let c;
				e.getElement(f) === t.getElement(a) ? (c = 0 === f || 0 === a ? 0 : i.get(f - 1, a - 1), f > 0 && a > 0 && 3 === s.get(f - 1, a - 1) && (c += o.get(f - 1, a - 1)), c += r ? r(f, a) : 1) : c = -1;
				const h = Math.max(l, u, c);
				if (h === c) {
					const e = f > 0 && a > 0 ? o.get(f - 1, a - 1) : 0;
					o.set(f, a, e + 1), s.set(f, a, 3);
				} else h === l ? (o.set(f, a, 0), s.set(f, a, 1)) : h === u && (o.set(f, a, 0), s.set(f, a, 2));
				i.set(f, a, h);
			}
			const a = [];
			let l = e.length, u = t.length;
			function c(e, t) {
				e + 1 === l && t + 1 === u || a.push(new ci(new Mr(e + 1, l), new Mr(t + 1, u))), l = e, u = t;
			}
			let h = e.length - 1, d = t.length - 1;
			for (; h >= 0 && d >= 0;) 3 === s.get(h, d) ? (c(h, d), h--, d--) : 1 === s.get(h, d) ? h-- : d--;
			return c(-1, -1), a.reverse(), new ui(a, !1);
		}
	}, yi = class {
		compute(e, t, n = di.instance) {
			if (0 === e.length || 0 === t.length) return ui.trivial(e, t);
			const r = e, i = t;
			function s(e, t) {
				for (; e < r.length && t < i.length && r.getElement(e) === i.getElement(t);) e++, t++;
				return e;
			}
			let o = 0;
			const a = new wi();
			a.set(0, s(0, 0));
			const l = new _i();
			l.set(0, 0 === a.get(0) ? null : new vi(null, 0, 0, a.get(0)));
			let u = 0;
			e: for (;;) {
				if (o++, !n.isValid()) return ui.trivialTimedOut(r, i);
				const e = -Math.min(o, i.length + o % 2), t = Math.min(o, r.length + o % 2);
				for (u = e; u <= t; u += 2) {
					const n = u === t ? -1 : a.get(u + 1), o = u === e ? -1 : a.get(u - 1) + 1, c = Math.min(Math.max(n, o), r.length), h = c - u;
					if (c > r.length || h > i.length) continue;
					const d = s(c, h);
					a.set(u, d);
					const f = c === n ? l.get(u + 1) : l.get(u - 1);
					if (l.set(u, d !== c ? new vi(f, c, h, d - c) : f), a.get(u) === r.length && a.get(u) - u === i.length) break e;
				}
			}
			let c = l.get(u);
			const h = [];
			let d = r.length, f = i.length;
			for (;;) {
				const e = c ? c.x + c.length : 0, t = c ? c.y + c.length : 0;
				if (e === d && t === f || h.push(new ci(new Mr(e, d), new Mr(t, f))), !c) break;
				d = c.x, f = c.y, c = c.prev;
			}
			return h.reverse(), new ui(h, !1);
		}
	}, vi = class {
		constructor(e, t, n, r) {
			this.prev = e, this.x = t, this.y = n, this.length = r;
		}
	}, wi = class {
		constructor() {
			this.positiveArr = new Int32Array(10), this.negativeArr = new Int32Array(10);
		}
		get(e) {
			return e < 0 ? (e = -e - 1, this.negativeArr[e]) : this.positiveArr[e];
		}
		set(e, t) {
			if (e < 0) {
				if ((e = -e - 1) >= this.negativeArr.length) {
					const e = this.negativeArr;
					this.negativeArr = new Int32Array(2 * e.length), this.negativeArr.set(e);
				}
				this.negativeArr[e] = t;
			} else {
				if (e >= this.positiveArr.length) {
					const e = this.positiveArr;
					this.positiveArr = new Int32Array(2 * e.length), this.positiveArr.set(e);
				}
				this.positiveArr[e] = t;
			}
		}
	}, _i = class {
		constructor() {
			this.positiveArr = [], this.negativeArr = [];
		}
		get(e) {
			return e < 0 ? (e = -e - 1, this.negativeArr[e]) : this.positiveArr[e];
		}
		set(e, t) {
			e < 0 ? (e = -e - 1, this.negativeArr[e] = t) : this.positiveArr[e] = t;
		}
	}, Ci = class {
		constructor(e, t, n) {
			this.lines = e, this.range = t, this.considerWhitespaceChanges = n, this.elements = [], this.firstElementOffsetByLineIdx = [], this.lineStartOffsets = [], this.trimmedWsLengthsByLineIdx = [], this.firstElementOffsetByLineIdx.push(0);
			for (let r = this.range.startLineNumber; r <= this.range.endLineNumber; r++) {
				let t = e[r - 1], i = 0;
				r === this.range.startLineNumber && this.range.startColumn > 1 && (i = this.range.startColumn - 1, t = t.substring(i)), this.lineStartOffsets.push(i);
				let s = 0;
				if (!n) {
					const e = t.trimStart();
					s = t.length - e.length, t = e.trimEnd();
				}
				this.trimmedWsLengthsByLineIdx.push(s);
				const o = r === this.range.endLineNumber ? Math.min(this.range.endColumn - 1 - i - s, t.length) : t.length;
				for (let e = 0; e < o; e++) this.elements.push(t.charCodeAt(e));
				r < this.range.endLineNumber && (this.elements.push("\n".charCodeAt(0)), this.firstElementOffsetByLineIdx.push(this.elements.length));
			}
		}
		toString() {
			return `Slice: "${this.text}"`;
		}
		get text() {
			return this.getText(new Mr(0, this.length));
		}
		getText(e) {
			return this.elements.slice(e.start, e.endExclusive).map((e) => String.fromCharCode(e)).join("");
		}
		getElement(e) {
			return this.elements[e];
		}
		get length() {
			return this.elements.length;
		}
		getBoundaryScore(e) {
			const t = Ei(e > 0 ? this.elements[e - 1] : -1), n = Ei(e < this.elements.length ? this.elements[e] : -1);
			if (7 === t && 8 === n) return 0;
			if (8 === t) return 150;
			let r = 0;
			return t !== n && (r += 10, 0 === t && 1 === n && (r += 1)), r += xi(t), r += xi(n), r;
		}
		translateOffset(e, t = "right") {
			const n = Ir(this.firstElementOffsetByLineIdx, (t) => t <= e), r = e - this.firstElementOffsetByLineIdx[n];
			return new Fe(this.range.startLineNumber + n, 1 + this.lineStartOffsets[n] + r + (0 === r && "left" === t ? 0 : this.trimmedWsLengthsByLineIdx[n]));
		}
		translateRange(e) {
			const t = this.translateOffset(e.start, "right"), n = this.translateOffset(e.endExclusive, "left");
			return n.isBefore(t) ? De.fromPositions(n, n) : De.fromPositions(t, n);
		}
		findWordContaining(e) {
			if (e < 0 || e >= this.elements.length) return;
			if (!Si(this.elements[e])) return;
			let t = e;
			for (; t > 0 && Si(this.elements[t - 1]);) t--;
			let n = e;
			for (; n < this.elements.length && Si(this.elements[n]);) n++;
			return new Mr(t, n);
		}
		findSubWordContaining(e) {
			if (e < 0 || e >= this.elements.length) return;
			if (!Si(this.elements[e])) return;
			let t = e;
			for (; t > 0 && Si(this.elements[t - 1]) && !Li(this.elements[t]);) t--;
			let n = e;
			for (; n < this.elements.length && Si(this.elements[n]) && !Li(this.elements[n]);) n++;
			return new Mr(t, n);
		}
		countLinesIn(e) {
			return this.translateOffset(e.endExclusive).lineNumber - this.translateOffset(e.start).lineNumber;
		}
		isStronglyEqual(e, t) {
			return this.elements[e] === this.elements[t];
		}
		extendToFullLines(e) {
			return new Mr(Or(this.firstElementOffsetByLineIdx, (t) => t <= e.start) ?? 0, function(e, t) {
				const n = Pr(e, t);
				return n === e.length ? void 0 : e[n];
			}(this.firstElementOffsetByLineIdx, (t) => e.endExclusive <= t) ?? this.elements.length);
		}
	};
	function Si(e) {
		return e >= 97 && e <= 122 || e >= 65 && e <= 90 || e >= 48 && e <= 57;
	}
	function Li(e) {
		return e >= 65 && e <= 90;
	}
	const Ni = {
		0: 0,
		1: 0,
		2: 0,
		3: 10,
		4: 2,
		5: 30,
		6: 3,
		7: 10,
		8: 10
	};
	function xi(e) {
		return Ni[e];
	}
	function Ei(e) {
		return 10 === e ? 8 : 13 === e ? 7 : gi(e) ? 6 : e >= 97 && e <= 122 ? 0 : e >= 65 && e <= 90 ? 1 : e >= 48 && e <= 57 ? 2 : -1 === e ? 3 : 44 === e || 59 === e ? 5 : 4;
	}
	function Ai(e, t, n, r, i, s) {
		let { moves: o, excludedChanges: a } = function(e, t, n, r) {
			const i = [], s = e.filter((e) => e.modified.isEmpty && e.original.length >= 3).map((e) => new pi(e.original, t, e)), o = new Set(e.filter((e) => e.original.isEmpty && e.modified.length >= 3).map((e) => new pi(e.modified, n, e))), a = /* @__PURE__ */ new Set();
			for (const l of s) {
				let e, t = -1;
				for (const n of o) {
					const r = l.computeSimilarity(n);
					r > t && (t = r, e = n);
				}
				if (t > .9 && e && (o.delete(e), i.push(new Hr(l.range, e.range)), a.add(l.source), a.add(e.source)), !r.isValid()) return {
					moves: i,
					excludedChanges: a
				};
			}
			return {
				moves: i,
				excludedChanges: a
			};
		}(e, t, n, s);
		if (!s.isValid()) return [];
		const l = function(e, t, n, r, i, s) {
			const o = [], a = new dr();
			for (const f of e) for (let e = f.original.startLineNumber; e < f.original.endLineNumberExclusive - 2; e++) {
				const n = `${t[e - 1]}:${t[e + 1 - 1]}:${t[e + 2 - 1]}`;
				a.add(n, { range: new Fr(e, e + 3) });
			}
			const l = [];
			e.sort(Rr((e) => e.modified.startLineNumber, Tr));
			for (const f of e) {
				let e = [];
				for (let t = f.modified.startLineNumber; t < f.modified.endLineNumberExclusive - 2; t++) {
					const r = `${n[t - 1]}:${n[t + 1 - 1]}:${n[t + 2 - 1]}`, i = new Fr(t, t + 3), s = [];
					a.forEach(r, ({ range: t }) => {
						for (const r of e) if (r.originalLineRange.endLineNumberExclusive + 1 === t.endLineNumberExclusive && r.modifiedLineRange.endLineNumberExclusive + 1 === i.endLineNumberExclusive) return r.originalLineRange = new Fr(r.originalLineRange.startLineNumber, t.endLineNumberExclusive), r.modifiedLineRange = new Fr(r.modifiedLineRange.startLineNumber, i.endLineNumberExclusive), void s.push(r);
						const n = {
							modifiedLineRange: i,
							originalLineRange: t
						};
						l.push(n), s.push(n);
					}), e = s;
				}
				if (!s.isValid()) return [];
			}
			l.sort((u = Rr((e) => e.modifiedLineRange.length, Tr), (e, t) => -u(e, t)));
			var u;
			const c = new Dr(), h = new Dr();
			for (const f of l) {
				const e = f.modifiedLineRange.startLineNumber - f.originalLineRange.startLineNumber, t = c.subtractFrom(f.modifiedLineRange), n = h.subtractFrom(f.originalLineRange).getWithDelta(e), r = t.getIntersection(n);
				for (const i of r.ranges) {
					if (i.length < 3) continue;
					const t = i, n = i.delta(-e);
					o.push(new Hr(n, t)), c.addRange(t), h.addRange(n);
				}
			}
			o.sort(Rr((e) => e.original.startLineNumber, Tr));
			const d = new Vr(e);
			for (let f = 0; f < o.length; f++) {
				const t = o[f], n = d.findLastMonotonous((e) => e.original.startLineNumber <= t.original.startLineNumber), a = Or(e, (e) => e.modified.startLineNumber <= t.modified.startLineNumber), l = Math.max(t.original.startLineNumber - n.original.startLineNumber, t.modified.startLineNumber - a.modified.startLineNumber), u = d.findLastMonotonous((e) => e.original.startLineNumber < t.original.endLineNumberExclusive), m = Or(e, (e) => e.modified.startLineNumber < t.modified.endLineNumberExclusive), g = Math.max(u.original.endLineNumberExclusive - t.original.endLineNumberExclusive, m.modified.endLineNumberExclusive - t.modified.endLineNumberExclusive);
				let p, b;
				for (p = 0; p < l; p++) {
					const e = t.original.startLineNumber - p - 1, n = t.modified.startLineNumber - p - 1;
					if (e > r.length || n > i.length) break;
					if (c.contains(n) || h.contains(e)) break;
					if (!ki(r[e - 1], i[n - 1], s)) break;
				}
				for (p > 0 && (h.addRange(new Fr(t.original.startLineNumber - p, t.original.startLineNumber)), c.addRange(new Fr(t.modified.startLineNumber - p, t.modified.startLineNumber))), b = 0; b < g; b++) {
					const e = t.original.endLineNumberExclusive + b, n = t.modified.endLineNumberExclusive + b;
					if (e > r.length || n > i.length) break;
					if (c.contains(n) || h.contains(e)) break;
					if (!ki(r[e - 1], i[n - 1], s)) break;
				}
				b > 0 && (h.addRange(new Fr(t.original.endLineNumberExclusive, t.original.endLineNumberExclusive + b)), c.addRange(new Fr(t.modified.endLineNumberExclusive, t.modified.endLineNumberExclusive + b))), (p > 0 || b > 0) && (o[f] = new Hr(new Fr(t.original.startLineNumber - p, t.original.endLineNumberExclusive + b), new Fr(t.modified.startLineNumber - p, t.modified.endLineNumberExclusive + b)));
			}
			return o;
		}(e.filter((e) => !a.has(e)), r, i, t, n, s);
		return function(e, t) {
			for (const n of t) e.push(n);
		}(o, l), o = function(e) {
			if (0 === e.length) return e;
			e.sort(Rr((e) => e.original.startLineNumber, Tr));
			const t = [e[0]];
			for (let n = 1; n < e.length; n++) {
				const r = t[t.length - 1], i = e[n], s = i.original.startLineNumber - r.original.endLineNumberExclusive, o = i.modified.startLineNumber - r.modified.endLineNumberExclusive;
				s >= 0 && o >= 0 && s + o <= 2 ? t[t.length - 1] = r.join(i) : t.push(i);
			}
			return t;
		}(o), o = o.filter((e) => {
			const n = e.original.toOffsetRange().slice(t).map((e) => e.trim());
			return n.join("\n").length >= 15 && function(e, t) {
				let n = 0;
				for (const r of e) t(r) && n++;
				return n;
			}(n, (e) => e.length >= 2) >= 2;
		}), o = function(e, t) {
			const n = new Vr(e);
			return t = t.filter((t) => (n.findLastMonotonous((e) => e.original.startLineNumber < t.original.endLineNumberExclusive) || new Hr(new Fr(1, 1), new Fr(1, 1))) !== Or(e, (e) => e.modified.startLineNumber < t.modified.endLineNumberExclusive)), t;
		}(e, o), o;
	}
	function ki(e, t, n) {
		if (e.trim() === t.trim()) return !0;
		if (e.length > 300 && t.length > 300) return !1;
		const r = new yi().compute(new Ci([e], new De(1, 1, 1, e.length), !1), new Ci([t], new De(1, 1, 1, t.length), !1), n);
		let i = 0;
		const s = ci.invert(r.diffs, e.length);
		for (const a of s) a.seq1Range.forEach((t) => {
			gi(e.charCodeAt(t)) || i++;
		});
		const o = function(t) {
			let n = 0;
			for (let r = 0; r < e.length; r++) gi(t.charCodeAt(r)) || n++;
			return n;
		}(e.length > t.length ? e : t);
		return i / o > .6 && o > 10;
	}
	function Ri(e, t, n) {
		let r = n;
		return r = Ti(e, t, r), r = Ti(e, t, r), r = function(e, t, n) {
			if (!e.getBoundaryScore || !t.getBoundaryScore) return n;
			for (let r = 0; r < n.length; r++) {
				const i = r > 0 ? n[r - 1] : void 0, s = n[r], o = r + 1 < n.length ? n[r + 1] : void 0, a = new Mr(i ? i.seq1Range.endExclusive + 1 : 0, o ? o.seq1Range.start - 1 : e.length), l = new Mr(i ? i.seq2Range.endExclusive + 1 : 0, o ? o.seq2Range.start - 1 : t.length);
				s.seq1Range.isEmpty ? n[r] = Mi(s, e, t, a, l) : s.seq2Range.isEmpty && (n[r] = Mi(s.swap(), t, e, l, a).swap());
			}
			return n;
		}(e, t, r), r;
	}
	function Ti(e, t, n) {
		if (0 === n.length) return n;
		const r = [];
		r.push(n[0]);
		for (let s = 1; s < n.length; s++) {
			const i = r[r.length - 1];
			let o = n[s];
			if (o.seq1Range.isEmpty || o.seq2Range.isEmpty) {
				const n = o.seq1Range.start - i.seq1Range.endExclusive;
				let s;
				for (s = 1; s <= n && e.getElement(o.seq1Range.start - s) === e.getElement(o.seq1Range.endExclusive - s) && t.getElement(o.seq2Range.start - s) === t.getElement(o.seq2Range.endExclusive - s); s++);
				if (s--, s === n) {
					r[r.length - 1] = new ci(new Mr(i.seq1Range.start, o.seq1Range.endExclusive - n), new Mr(i.seq2Range.start, o.seq2Range.endExclusive - n));
					continue;
				}
				o = o.delta(-s);
			}
			r.push(o);
		}
		const i = [];
		for (let s = 0; s < r.length - 1; s++) {
			const n = r[s + 1];
			let o = r[s];
			if (o.seq1Range.isEmpty || o.seq2Range.isEmpty) {
				const i = n.seq1Range.start - o.seq1Range.endExclusive;
				let a;
				for (a = 0; a < i && e.isStronglyEqual(o.seq1Range.start + a, o.seq1Range.endExclusive + a) && t.isStronglyEqual(o.seq2Range.start + a, o.seq2Range.endExclusive + a); a++);
				if (a === i) {
					r[s + 1] = new ci(new Mr(o.seq1Range.start + i, n.seq1Range.endExclusive), new Mr(o.seq2Range.start + i, n.seq2Range.endExclusive));
					continue;
				}
				a > 0 && (o = o.delta(a));
			}
			i.push(o);
		}
		return r.length > 0 && i.push(r[r.length - 1]), i;
	}
	function Mi(e, t, n, r, i) {
		let s = 1;
		for (; e.seq1Range.start - s >= r.start && e.seq2Range.start - s >= i.start && n.isStronglyEqual(e.seq2Range.start - s, e.seq2Range.endExclusive - s) && s < 100;) s++;
		s--;
		let o = 0;
		for (; e.seq1Range.start + o < r.endExclusive && e.seq2Range.endExclusive + o < i.endExclusive && n.isStronglyEqual(e.seq2Range.start + o, e.seq2Range.endExclusive + o) && o < 100;) o++;
		if (0 === s && 0 === o) return e;
		let a = 0, l = -1;
		for (let u = -s; u <= o; u++) {
			const r = e.seq2Range.start + u, i = e.seq2Range.endExclusive + u, s = e.seq1Range.start + u, o = t.getBoundaryScore(s) + n.getBoundaryScore(r) + n.getBoundaryScore(i);
			o > l && (l = o, a = u);
		}
		return e.delta(a);
	}
	function Oi(e, t, n, r, i = !1) {
		const s = ci.invert(n, e.length), o = [];
		let a = new hi(0, 0);
		function l(n, l) {
			if (n.offset1 < a.offset1 || n.offset2 < a.offset2) return;
			const u = r(e, n.offset1), c = r(t, n.offset2);
			if (!u || !c) return;
			let h = new ci(u, c);
			const d = h.intersect(l);
			let f = d.seq1Range.length, m = d.seq2Range.length;
			for (; s.length > 0;) {
				const n = s[0];
				if (!n.seq1Range.intersects(h.seq1Range) && !n.seq2Range.intersects(h.seq2Range)) break;
				const i = new ci(r(e, n.seq1Range.start), r(t, n.seq2Range.start)), o = i.intersect(n);
				if (f += o.seq1Range.length, m += o.seq2Range.length, h = h.join(i), !(h.seq1Range.endExclusive >= n.seq1Range.endExclusive)) break;
				s.shift();
			}
			(i && f + m < h.seq1Range.length + h.seq2Range.length || f + m < 2 * (h.seq1Range.length + h.seq2Range.length) / 3) && o.push(h), a = h.getEndExclusives();
		}
		for (; s.length > 0;) {
			const e = s.shift();
			e.seq1Range.isEmpty || (l(e.getStarts(), e), l(e.getEndExclusives().delta(-1), e));
		}
		return function(e, t) {
			const n = [];
			for (; e.length > 0 || t.length > 0;) {
				const r = e[0], i = t[0];
				let s;
				s = r && (!i || r.seq1Range.start < i.seq1Range.start) ? e.shift() : t.shift(), n.length > 0 && n[n.length - 1].seq1Range.endExclusive >= s.seq1Range.start ? n[n.length - 1] = n[n.length - 1].join(s) : n.push(s);
			}
			return n;
		}(n, o);
	}
	var Ii = class {
		constructor(e, t) {
			this.trimmedHash = e, this.lines = t;
		}
		getElement(e) {
			return this.trimmedHash[e];
		}
		get length() {
			return this.trimmedHash.length;
		}
		getBoundaryScore(e) {
			return 1e3 - ((0 === e ? 0 : Pi(this.lines[e - 1])) + (e === this.lines.length ? 0 : Pi(this.lines[e])));
		}
		getText(e) {
			return this.lines.slice(e.start, e.endExclusive).join("\n");
		}
		isStronglyEqual(e, t) {
			return this.lines[e] === this.lines[t];
		}
	};
	function Pi(e) {
		let t = 0;
		for (; t < e.length && (32 === e.charCodeAt(t) || 9 === e.charCodeAt(t));) t++;
		return t;
	}
	var Vi = class {
		constructor() {
			this.dynamicProgrammingDiffing = new bi(), this.myersDiffingAlgorithm = new yi();
		}
		computeDiff(e, t, n) {
			if (e.length <= 1 && function(e, t, n = (e, t) => e === t) {
				if (e === t) return !0;
				if (!e || !t) return !1;
				if (e.length !== t.length) return !1;
				for (let r = 0, i = e.length; r < i; r++) if (!n(e[r], t[r])) return !1;
				return !0;
			}(e, t, (e, t) => e === t)) return new Ar([], [], !1);
			if (1 === e.length && 0 === e[0].length || 1 === t.length && 0 === t[0].length) return new Ar([new Xr(new Fr(1, e.length + 1), new Fr(1, t.length + 1), [new Qr(new De(1, 1, e.length, e[e.length - 1].length + 1), new De(1, 1, t.length, t[t.length - 1].length + 1))])], [], !1);
			const r = 0 === n.maxComputationTimeMs ? di.instance : new fi(n.maxComputationTimeMs), i = !n.ignoreTrimWhitespace, s = /* @__PURE__ */ new Map();
			function o(e) {
				let t = s.get(e);
				return void 0 === t && (t = s.size, s.set(e, t)), t;
			}
			const a = e.map((e) => o(e.trim())), u = t.map((e) => o(e.trim())), c = new Ii(a, e), h = new Ii(u, t), d = c.length + h.length < 1700 ? this.dynamicProgrammingDiffing.compute(c, h, r, (n, r) => e[n] === t[r] ? 0 === t[r].length ? .1 : 1 + Math.log(1 + t[r].length) : .99) : this.myersDiffingAlgorithm.compute(c, h, r);
			let f = d.diffs, m = d.hitTimeout;
			f = Ri(c, h, f), f = function(e, t, n) {
				let r = n;
				if (0 === r.length) return r;
				let i, s = 0;
				do {
					i = !1;
					const o = [r[0]];
					for (let a = 1; a < r.length; a++) {
						const l = r[a], u = o[o.length - 1];
						function c(t, n) {
							const r = new Mr(u.seq1Range.endExclusive, l.seq1Range.start);
							return e.getText(r).replace(/\s/g, "").length <= 4 && (t.seq1Range.length + t.seq2Range.length > 5 || n.seq1Range.length + n.seq2Range.length > 5);
						}
						c(u, l) ? (i = !0, o[o.length - 1] = o[o.length - 1].join(l)) : o.push(l);
					}
					r = o;
				} while (s++ < 10 && i);
				return r;
			}(c, 0, f);
			const g = [], p = (s) => {
				if (i) for (let o = 0; o < s; o++) {
					const s = b + o, a = y + o;
					if (e[s] !== t[a]) {
						const o = this.refineDiff(e, t, new ci(new Mr(s, s + 1), new Mr(a, a + 1)), r, i, n);
						for (const e of o.mappings) g.push(e);
						o.hitTimeout && (m = !0);
					}
				}
			};
			let b = 0, y = 0;
			for (const _ of f) {
				l(() => _.seq1Range.start - b === _.seq2Range.start - y), p(_.seq1Range.start - b), b = _.seq1Range.endExclusive, y = _.seq2Range.endExclusive;
				const s = this.refineDiff(e, t, _, r, i, n);
				s.hitTimeout && (m = !0);
				for (const e of s.mappings) g.push(e);
			}
			p(e.length - b);
			const v = Zr(g, new Wr(e), new Wr(t));
			let w = [];
			return n.computeMoves && (w = this.computeMoves(v, e, t, a, u, r, i, n)), l(() => {
				function n(e, t) {
					if (e.lineNumber < 1 || e.lineNumber > t.length) return !1;
					const n = t[e.lineNumber - 1];
					return !(e.column < 1 || e.column > n.length + 1);
				}
				function r(e, t) {
					return !(e.startLineNumber < 1 || e.startLineNumber > t.length + 1) && !(e.endLineNumberExclusive < 1 || e.endLineNumberExclusive > t.length + 1);
				}
				for (const i of v) {
					if (!i.innerChanges) return !1;
					for (const r of i.innerChanges) if (!(n(r.modifiedRange.getStartPosition(), t) && n(r.modifiedRange.getEndPosition(), t) && n(r.originalRange.getStartPosition(), e) && n(r.originalRange.getEndPosition(), e))) return !1;
					if (!r(i.modified, t) || !r(i.original, e)) return !1;
				}
				return !0;
			}), new Ar(v, w, m);
		}
		computeMoves(e, t, n, r, i, s, o, a) {
			return Ai(e, t, n, r, i, s).map((e) => new kr(e, Zr(this.refineDiff(t, n, new ci(e.original.toOffsetRange(), e.modified.toOffsetRange()), s, o, a).mappings, new Wr(t), new Wr(n), !0)));
		}
		refineDiff(e, t, n, r, i, s) {
			const o = (a = n, new Hr(new Fr(a.seq1Range.start + 1, a.seq1Range.endExclusive + 1), new Fr(a.seq2Range.start + 1, a.seq2Range.endExclusive + 1))).toRangeMapping2(e, t);
			var a;
			const l = new Ci(e, o.originalRange, i), u = new Ci(t, o.modifiedRange, i), c = l.length + u.length < 500 ? this.dynamicProgrammingDiffing.compute(l, u, r) : this.myersDiffingAlgorithm.compute(l, u, r);
			let h = c.diffs;
			return h = Ri(l, u, h), h = Oi(l, u, h, (e, t) => e.findWordContaining(t)), s.extendToSubwords && (h = Oi(l, u, h, (e, t) => e.findSubWordContaining(t), !0)), h = function(e, t, n) {
				const r = [];
				for (const i of n) {
					const e = r[r.length - 1];
					e && (i.seq1Range.start - e.seq1Range.endExclusive <= 2 || i.seq2Range.start - e.seq2Range.endExclusive <= 2) ? r[r.length - 1] = new ci(e.seq1Range.join(i.seq1Range), e.seq2Range.join(i.seq2Range)) : r.push(i);
				}
				return r;
			}(0, 0, h), h = function(e, t, n) {
				let r = n;
				if (0 === r.length) return r;
				let i, s = 0;
				do {
					i = !1;
					const a = [r[0]];
					for (let l = 1; l < r.length; l++) {
						const u = r[l], c = a[a.length - 1];
						function h(n, r) {
							const i = new Mr(c.seq1Range.endExclusive, u.seq1Range.start);
							if (e.countLinesIn(i) > 5 || i.length > 500) return !1;
							const s = e.getText(i).trim();
							if (s.length > 20 || s.split(/\r\n|\r|\n/).length > 1) return !1;
							const o = e.countLinesIn(n.seq1Range), a = n.seq1Range.length, l = t.countLinesIn(n.seq2Range), h = n.seq2Range.length, d = e.countLinesIn(r.seq1Range), f = r.seq1Range.length, m = t.countLinesIn(r.seq2Range), g = r.seq2Range.length;
							function p(e) {
								return Math.min(e, 130);
							}
							return Math.pow(Math.pow(p(40 * o + a), 1.5) + Math.pow(p(40 * l + h), 1.5), 1.5) + Math.pow(Math.pow(p(40 * d + f), 1.5) + Math.pow(p(40 * m + g), 1.5), 1.5) > 74184.96480721243;
						}
						h(c, u) ? (i = !0, a[a.length - 1] = a[a.length - 1].join(u)) : a.push(u);
					}
					r = a;
				} while (s++ < 10 && i);
				const o = [];
				return function(e, t) {
					for (let n = 0; n < e.length; n++) t(0 === n ? void 0 : e[n - 1], e[n], n + 1 === e.length ? void 0 : e[n + 1]);
				}(r, (t, n, r) => {
					let i = n;
					function s(e) {
						return e.length > 0 && e.trim().length <= 3 && n.seq1Range.length + n.seq2Range.length > 100;
					}
					const a = e.extendToFullLines(n.seq1Range), l = e.getText(new Mr(a.start, n.seq1Range.start));
					s(l) && (i = i.deltaStart(-l.length));
					const u = e.getText(new Mr(n.seq1Range.endExclusive, a.endExclusive));
					s(u) && (i = i.deltaEnd(u.length));
					const c = ci.fromOffsetPairs(t ? t.getEndExclusives() : hi.zero, r ? r.getStarts() : hi.max), h = i.intersect(c);
					o.length > 0 && h.getStarts().equals(o[o.length - 1].getEndExclusives()) ? o[o.length - 1] = o[o.length - 1].join(h) : o.push(h);
				}), o;
			}(l, u, h), {
				mappings: h.map((e) => new Qr(l.translateRange(e.seq1Range), u.translateRange(e.seq2Range))),
				hitTimeout: c.hitTimeout
			};
		}
	};
	const Fi = () => new Yr(), Di = () => new Vi();
	function qi(e, t) {
		const n = Math.pow(10, t);
		return Math.round(e * n) / n;
	}
	var Ki = class {
		constructor(e, t, n, r = 1) {
			this._rgbaBrand = void 0, this.r = 0 | Math.min(255, Math.max(0, e)), this.g = 0 | Math.min(255, Math.max(0, t)), this.b = 0 | Math.min(255, Math.max(0, n)), this.a = qi(Math.max(Math.min(1, r), 0), 3);
		}
		static equals(e, t) {
			return e.r === t.r && e.g === t.g && e.b === t.b && e.a === t.a;
		}
	}, Bi = class e {
		constructor(e, t, n, r) {
			this._hslaBrand = void 0, this.h = 0 | Math.max(Math.min(360, e), 0), this.s = qi(Math.max(Math.min(1, t), 0), 3), this.l = qi(Math.max(Math.min(1, n), 0), 3), this.a = qi(Math.max(Math.min(1, r), 0), 3);
		}
		static equals(e, t) {
			return e.h === t.h && e.s === t.s && e.l === t.l && e.a === t.a;
		}
		static fromRGBA(t) {
			const n = t.r / 255, r = t.g / 255, i = t.b / 255, s = t.a, o = Math.max(n, r, i), a = Math.min(n, r, i);
			let l = 0, u = 0;
			const c = (a + o) / 2, h = o - a;
			if (h > 0) {
				switch (u = Math.min(c <= .5 ? h / (2 * c) : h / (2 - 2 * c), 1), o) {
					case n:
						l = (r - i) / h + (r < i ? 6 : 0);
						break;
					case r:
						l = (i - n) / h + 2;
						break;
					case i: l = (n - r) / h + 4;
				}
				l *= 60, l = Math.round(l);
			}
			return new e(l, u, c, s);
		}
		static _hue2rgb(e, t, n) {
			return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + 6 * (t - e) * n : n < .5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
		}
		static toRGBA(t) {
			const n = t.h / 360, { s: r, l: i, a: s } = t;
			let o, a, l;
			if (0 === r) o = a = l = i;
			else {
				const t = i < .5 ? i * (1 + r) : i + r - i * r, s = 2 * i - t;
				o = e._hue2rgb(s, t, n + 1 / 3), a = e._hue2rgb(s, t, n), l = e._hue2rgb(s, t, n - 1 / 3);
			}
			return new Ki(Math.round(255 * o), Math.round(255 * a), Math.round(255 * l), s);
		}
	}, $i = class e {
		constructor(e, t, n, r) {
			this._hsvaBrand = void 0, this.h = 0 | Math.max(Math.min(360, e), 0), this.s = qi(Math.max(Math.min(1, t), 0), 3), this.v = qi(Math.max(Math.min(1, n), 0), 3), this.a = qi(Math.max(Math.min(1, r), 0), 3);
		}
		static equals(e, t) {
			return e.h === t.h && e.s === t.s && e.v === t.v && e.a === t.a;
		}
		static fromRGBA(t) {
			const n = t.r / 255, r = t.g / 255, i = t.b / 255, s = Math.max(n, r, i), o = s - Math.min(n, r, i), a = 0 === s ? 0 : o / s;
			let l;
			return l = 0 === o ? 0 : s === n ? ((r - i) / o % 6 + 6) % 6 : s === r ? (i - n) / o + 2 : (n - r) / o + 4, new e(Math.round(60 * l), a, s, t.a);
		}
		static toRGBA(e) {
			const { h: t, s: n, v: r, a: i } = e, s = r * n, o = s * (1 - Math.abs(t / 60 % 2 - 1)), a = r - s;
			let [l, u, c] = [
				0,
				0,
				0
			];
			return t < 60 ? (l = s, u = o) : t < 120 ? (l = o, u = s) : t < 180 ? (u = s, c = o) : t < 240 ? (u = o, c = s) : t < 300 ? (l = o, c = s) : t <= 360 && (l = s, c = o), l = Math.round(255 * (l + a)), u = Math.round(255 * (u + a)), c = Math.round(255 * (c + a)), new Ki(l, u, c, i);
		}
	}, Ui = class e {
		static fromHex(t) {
			return e.Format.CSS.parseHex(t) || e.red;
		}
		static equals(e, t) {
			return !e && !t || !(!e || !t) && e.equals(t);
		}
		get hsla() {
			return this._hsla ? this._hsla : Bi.fromRGBA(this.rgba);
		}
		get hsva() {
			return this._hsva ? this._hsva : $i.fromRGBA(this.rgba);
		}
		constructor(e) {
			if (!e) throw new Error("Color needs a value");
			if (e instanceof Ki) this.rgba = e;
			else if (e instanceof Bi) this._hsla = e, this.rgba = Bi.toRGBA(e);
			else {
				if (!(e instanceof $i)) throw new Error("Invalid color ctor argument");
				this._hsva = e, this.rgba = $i.toRGBA(e);
			}
		}
		equals(e) {
			return !!e && Ki.equals(this.rgba, e.rgba) && Bi.equals(this.hsla, e.hsla) && $i.equals(this.hsva, e.hsva);
		}
		getRelativeLuminance() {
			return qi(.2126 * e._relativeLuminanceForComponent(this.rgba.r) + .7152 * e._relativeLuminanceForComponent(this.rgba.g) + .0722 * e._relativeLuminanceForComponent(this.rgba.b), 4);
		}
		static _relativeLuminanceForComponent(e) {
			const t = e / 255;
			return t <= .03928 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4);
		}
		isLighter() {
			return (299 * this.rgba.r + 587 * this.rgba.g + 114 * this.rgba.b) / 1e3 >= 128;
		}
		isLighterThan(e) {
			return this.getRelativeLuminance() > e.getRelativeLuminance();
		}
		isDarkerThan(e) {
			return this.getRelativeLuminance() < e.getRelativeLuminance();
		}
		lighten(t) {
			return new e(new Bi(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * t, this.hsla.a));
		}
		darken(t) {
			return new e(new Bi(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * t, this.hsla.a));
		}
		transparent(t) {
			const { r: n, g: r, b: i, a: s } = this.rgba;
			return new e(new Ki(n, r, i, s * t));
		}
		isTransparent() {
			return 0 === this.rgba.a;
		}
		isOpaque() {
			return 1 === this.rgba.a;
		}
		opposite() {
			return new e(new Ki(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
		}
		mix(t, n = .5) {
			const r = Math.min(Math.max(n, 0), 1), i = this.rgba, s = t.rgba;
			return new e(new Ki(i.r + (s.r - i.r) * r, i.g + (s.g - i.g) * r, i.b + (s.b - i.b) * r, i.a + (s.a - i.a) * r));
		}
		makeOpaque(t) {
			if (this.isOpaque() || 1 !== t.rgba.a) return this;
			const { r: n, g: r, b: i, a: s } = this.rgba;
			return new e(new Ki(t.rgba.r - s * (t.rgba.r - n), t.rgba.g - s * (t.rgba.g - r), t.rgba.b - s * (t.rgba.b - i), 1));
		}
		toString() {
			return this._toString || (this._toString = e.Format.CSS.format(this)), this._toString;
		}
		toNumber32Bit() {
			return this._toNumber32Bit || (this._toNumber32Bit = (this.rgba.r << 24 | this.rgba.g << 16 | this.rgba.b << 8 | 255 * this.rgba.a) >>> 0), this._toNumber32Bit;
		}
		static getLighterColor(e, t, n) {
			if (e.isLighterThan(t)) return e;
			n = n || .5;
			const r = e.getRelativeLuminance(), i = t.getRelativeLuminance();
			return n = n * (i - r) / i, e.lighten(n);
		}
		static getDarkerColor(e, t, n) {
			if (e.isDarkerThan(t)) return e;
			n = n || .5;
			const r = e.getRelativeLuminance();
			return n = n * (r - t.getRelativeLuminance()) / r, e.darken(n);
		}
		static {
			this.white = new e(new Ki(255, 255, 255, 1));
		}
		static {
			this.black = new e(new Ki(0, 0, 0, 1));
		}
		static {
			this.red = new e(new Ki(255, 0, 0, 1));
		}
		static {
			this.blue = new e(new Ki(0, 0, 255, 1));
		}
		static {
			this.green = new e(new Ki(0, 255, 0, 1));
		}
		static {
			this.cyan = new e(new Ki(0, 255, 255, 1));
		}
		static {
			this.lightgrey = new e(new Ki(211, 211, 211, 1));
		}
		static {
			this.transparent = new e(new Ki(0, 0, 0, 0));
		}
	};
	function ji(e) {
		const t = [];
		for (const n of e) {
			const e = Number(n);
			(e || 0 === e && "" !== n.replace(/\s/g, "")) && t.push(e);
		}
		return t;
	}
	function Wi(e, t, n, r) {
		return {
			red: e / 255,
			blue: n / 255,
			green: t / 255,
			alpha: r
		};
	}
	function zi(e, t) {
		const n = t.index, r = t[0].length;
		if (void 0 === n) return;
		const i = e.positionAt(n);
		return {
			startLineNumber: i.lineNumber,
			startColumn: i.column,
			endLineNumber: i.lineNumber,
			endColumn: i.column + r
		};
	}
	function Hi(e, t) {
		if (!e) return;
		const n = Ui.Format.CSS.parseHex(t);
		return n ? {
			range: e,
			color: Wi(n.rgba.r, n.rgba.g, n.rgba.b, n.rgba.a)
		} : void 0;
	}
	function Gi(e, t, n) {
		if (!e || 1 !== t.length) return;
		const r = ji(t[0].values());
		return {
			range: e,
			color: Wi(r[0], r[1], r[2], n ? r[3] : 1)
		};
	}
	function Ji(e, t, n) {
		if (!e || 1 !== t.length) return;
		const r = ji(t[0].values()), i = new Ui(new Bi(r[0], r[1] / 100, r[2] / 100, n ? r[3] : 1));
		return {
			range: e,
			color: Wi(i.rgba.r, i.rgba.g, i.rgba.b, i.rgba.a)
		};
	}
	function Xi(e, t) {
		return "string" == typeof e ? [...e.matchAll(t)] : e.findMatches(t);
	}
	function Qi(e) {
		return e && "function" == typeof e.getValue && "function" == typeof e.positionAt ? function(e) {
			const t = [], n = Xi(e, /\b(rgb|rgba|hsl|hsla)(\([0-9\s,.\%]*\))|^(#)([A-Fa-f0-9]{3})\b|^(#)([A-Fa-f0-9]{4})\b|^(#)([A-Fa-f0-9]{6})\b|^(#)([A-Fa-f0-9]{8})\b|(?<=['"\s])(#)([A-Fa-f0-9]{3})\b|(?<=['"\s])(#)([A-Fa-f0-9]{4})\b|(?<=['"\s])(#)([A-Fa-f0-9]{6})\b|(?<=['"\s])(#)([A-Fa-f0-9]{8})\b/gm);
			if (n.length > 0) for (const r of n) {
				const n = r.filter((e) => void 0 !== e), i = n[1], s = n[2];
				if (!s) continue;
				let o;
				"rgb" === i ? o = Gi(zi(e, r), Xi(s, /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm), !1) : "rgba" === i ? o = Gi(zi(e, r), Xi(s, /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm), !0) : "hsl" === i ? o = Ji(zi(e, r), Xi(s, /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm), !1) : "hsla" === i ? o = Ji(zi(e, r), Xi(s, /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(0[.][0-9]+|[.][0-9]+|[01][.]0*|[01])\s*\)$/gm), !0) : "#" === i && (o = Hi(zi(e, r), i + s)), o && t.push(o);
			}
			return t;
		}(e) : [];
	}
	(function(e) {
		var t;
		(function(t) {
			function n(e) {
				const t = e.toString(16);
				return 2 !== t.length ? "0" + t : t;
			}
			function r(t) {
				const n = t.length;
				if (0 === n) return null;
				if (35 !== t.charCodeAt(0)) return null;
				if (7 === n) return new e(new Ki(16 * i(t.charCodeAt(1)) + i(t.charCodeAt(2)), 16 * i(t.charCodeAt(3)) + i(t.charCodeAt(4)), 16 * i(t.charCodeAt(5)) + i(t.charCodeAt(6)), 1));
				if (9 === n) return new e(new Ki(16 * i(t.charCodeAt(1)) + i(t.charCodeAt(2)), 16 * i(t.charCodeAt(3)) + i(t.charCodeAt(4)), 16 * i(t.charCodeAt(5)) + i(t.charCodeAt(6)), (16 * i(t.charCodeAt(7)) + i(t.charCodeAt(8))) / 255));
				if (4 === n) {
					const n = i(t.charCodeAt(1)), r = i(t.charCodeAt(2)), s = i(t.charCodeAt(3));
					return new e(new Ki(16 * n + n, 16 * r + r, 16 * s + s));
				}
				if (5 === n) {
					const n = i(t.charCodeAt(1)), r = i(t.charCodeAt(2)), s = i(t.charCodeAt(3)), o = i(t.charCodeAt(4));
					return new e(new Ki(16 * n + n, 16 * r + r, 16 * s + s, (16 * o + o) / 255));
				}
				return null;
			}
			function i(e) {
				switch (e) {
					case 48: return 0;
					case 49: return 1;
					case 50: return 2;
					case 51: return 3;
					case 52: return 4;
					case 53: return 5;
					case 54: return 6;
					case 55: return 7;
					case 56: return 8;
					case 57: return 9;
					case 97:
					case 65: return 10;
					case 98:
					case 66: return 11;
					case 99:
					case 67: return 12;
					case 100:
					case 68: return 13;
					case 101:
					case 69: return 14;
					case 102:
					case 70: return 15;
				}
				return 0;
			}
			t.formatRGB = function(t) {
				return 1 === t.rgba.a ? `rgb(${t.rgba.r}, ${t.rgba.g}, ${t.rgba.b})` : e.Format.CSS.formatRGBA(t);
			}, t.formatRGBA = function(e) {
				return `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${+e.rgba.a.toFixed(2)})`;
			}, t.formatHSL = function(t) {
				return 1 === t.hsla.a ? `hsl(${t.hsla.h}, ${Math.round(100 * t.hsla.s)}%, ${Math.round(100 * t.hsla.l)}%)` : e.Format.CSS.formatHSLA(t);
			}, t.formatHSLA = function(e) {
				return `hsla(${e.hsla.h}, ${Math.round(100 * e.hsla.s)}%, ${Math.round(100 * e.hsla.l)}%, ${e.hsla.a.toFixed(2)})`;
			}, t.formatHex = function(e) {
				return `#${n(e.rgba.r)}${n(e.rgba.g)}${n(e.rgba.b)}`;
			}, t.formatHexA = function(t, r = !1) {
				return r && 1 === t.rgba.a ? e.Format.CSS.formatHex(t) : `#${n(t.rgba.r)}${n(t.rgba.g)}${n(t.rgba.b)}${n(Math.round(255 * t.rgba.a))}`;
			}, t.format = function(t) {
				return t.isOpaque() ? e.Format.CSS.formatHex(t) : e.Format.CSS.formatRGBA(t);
			}, t.parse = function(t) {
				if ("transparent" === t) return e.transparent;
				if (t.startsWith("#")) return r(t);
				if (t.startsWith("rgba(")) {
					const n = t.match(/rgba\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+), *(?<a>(?:\+|-)?\d+(\.\d+)?)\)/);
					if (!n) throw new Error("Invalid color format " + t);
					return new e(new Ki(parseInt(n.groups?.r ?? "0"), parseInt(n.groups?.g ?? "0"), parseInt(n.groups?.b ?? "0"), parseFloat(n.groups?.a ?? "0")));
				}
				if (t.startsWith("rgb(")) {
					const n = t.match(/rgb\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+)\)/);
					if (!n) throw new Error("Invalid color format " + t);
					return new e(new Ki(parseInt(n.groups?.r ?? "0"), parseInt(n.groups?.g ?? "0"), parseInt(n.groups?.b ?? "0")));
				}
				return function(t) {
					switch (t) {
						case "aliceblue": return new e(new Ki(240, 248, 255, 1));
						case "antiquewhite": return new e(new Ki(250, 235, 215, 1));
						case "aqua":
						case "cyan": return new e(new Ki(0, 255, 255, 1));
						case "aquamarine": return new e(new Ki(127, 255, 212, 1));
						case "azure": return new e(new Ki(240, 255, 255, 1));
						case "beige": return new e(new Ki(245, 245, 220, 1));
						case "bisque": return new e(new Ki(255, 228, 196, 1));
						case "black": return new e(new Ki(0, 0, 0, 1));
						case "blanchedalmond": return new e(new Ki(255, 235, 205, 1));
						case "blue": return new e(new Ki(0, 0, 255, 1));
						case "blueviolet": return new e(new Ki(138, 43, 226, 1));
						case "brown": return new e(new Ki(165, 42, 42, 1));
						case "burlywood": return new e(new Ki(222, 184, 135, 1));
						case "cadetblue": return new e(new Ki(95, 158, 160, 1));
						case "chartreuse": return new e(new Ki(127, 255, 0, 1));
						case "chocolate": return new e(new Ki(210, 105, 30, 1));
						case "coral": return new e(new Ki(255, 127, 80, 1));
						case "cornflowerblue": return new e(new Ki(100, 149, 237, 1));
						case "cornsilk": return new e(new Ki(255, 248, 220, 1));
						case "crimson": return new e(new Ki(220, 20, 60, 1));
						case "darkblue": return new e(new Ki(0, 0, 139, 1));
						case "darkcyan": return new e(new Ki(0, 139, 139, 1));
						case "darkgoldenrod": return new e(new Ki(184, 134, 11, 1));
						case "darkgray":
						case "darkgrey": return new e(new Ki(169, 169, 169, 1));
						case "darkgreen": return new e(new Ki(0, 100, 0, 1));
						case "darkkhaki": return new e(new Ki(189, 183, 107, 1));
						case "darkmagenta": return new e(new Ki(139, 0, 139, 1));
						case "darkolivegreen": return new e(new Ki(85, 107, 47, 1));
						case "darkorange": return new e(new Ki(255, 140, 0, 1));
						case "darkorchid": return new e(new Ki(153, 50, 204, 1));
						case "darkred": return new e(new Ki(139, 0, 0, 1));
						case "darksalmon": return new e(new Ki(233, 150, 122, 1));
						case "darkseagreen": return new e(new Ki(143, 188, 143, 1));
						case "darkslateblue": return new e(new Ki(72, 61, 139, 1));
						case "darkslategray":
						case "darkslategrey": return new e(new Ki(47, 79, 79, 1));
						case "darkturquoise": return new e(new Ki(0, 206, 209, 1));
						case "darkviolet": return new e(new Ki(148, 0, 211, 1));
						case "deeppink": return new e(new Ki(255, 20, 147, 1));
						case "deepskyblue": return new e(new Ki(0, 191, 255, 1));
						case "dimgray":
						case "dimgrey": return new e(new Ki(105, 105, 105, 1));
						case "dodgerblue": return new e(new Ki(30, 144, 255, 1));
						case "firebrick": return new e(new Ki(178, 34, 34, 1));
						case "floralwhite": return new e(new Ki(255, 250, 240, 1));
						case "forestgreen": return new e(new Ki(34, 139, 34, 1));
						case "fuchsia":
						case "magenta": return new e(new Ki(255, 0, 255, 1));
						case "gainsboro": return new e(new Ki(220, 220, 220, 1));
						case "ghostwhite": return new e(new Ki(248, 248, 255, 1));
						case "gold": return new e(new Ki(255, 215, 0, 1));
						case "goldenrod": return new e(new Ki(218, 165, 32, 1));
						case "gray":
						case "grey": return new e(new Ki(128, 128, 128, 1));
						case "green": return new e(new Ki(0, 128, 0, 1));
						case "greenyellow": return new e(new Ki(173, 255, 47, 1));
						case "honeydew": return new e(new Ki(240, 255, 240, 1));
						case "hotpink": return new e(new Ki(255, 105, 180, 1));
						case "indianred": return new e(new Ki(205, 92, 92, 1));
						case "indigo": return new e(new Ki(75, 0, 130, 1));
						case "ivory": return new e(new Ki(255, 255, 240, 1));
						case "khaki": return new e(new Ki(240, 230, 140, 1));
						case "lavender": return new e(new Ki(230, 230, 250, 1));
						case "lavenderblush": return new e(new Ki(255, 240, 245, 1));
						case "lawngreen": return new e(new Ki(124, 252, 0, 1));
						case "lemonchiffon": return new e(new Ki(255, 250, 205, 1));
						case "lightblue": return new e(new Ki(173, 216, 230, 1));
						case "lightcoral": return new e(new Ki(240, 128, 128, 1));
						case "lightcyan": return new e(new Ki(224, 255, 255, 1));
						case "lightgoldenrodyellow": return new e(new Ki(250, 250, 210, 1));
						case "lightgray":
						case "lightgrey": return new e(new Ki(211, 211, 211, 1));
						case "lightgreen": return new e(new Ki(144, 238, 144, 1));
						case "lightpink": return new e(new Ki(255, 182, 193, 1));
						case "lightsalmon": return new e(new Ki(255, 160, 122, 1));
						case "lightseagreen": return new e(new Ki(32, 178, 170, 1));
						case "lightskyblue": return new e(new Ki(135, 206, 250, 1));
						case "lightslategray":
						case "lightslategrey": return new e(new Ki(119, 136, 153, 1));
						case "lightsteelblue": return new e(new Ki(176, 196, 222, 1));
						case "lightyellow": return new e(new Ki(255, 255, 224, 1));
						case "lime": return new e(new Ki(0, 255, 0, 1));
						case "limegreen": return new e(new Ki(50, 205, 50, 1));
						case "linen": return new e(new Ki(250, 240, 230, 1));
						case "maroon": return new e(new Ki(128, 0, 0, 1));
						case "mediumaquamarine": return new e(new Ki(102, 205, 170, 1));
						case "mediumblue": return new e(new Ki(0, 0, 205, 1));
						case "mediumorchid": return new e(new Ki(186, 85, 211, 1));
						case "mediumpurple": return new e(new Ki(147, 112, 219, 1));
						case "mediumseagreen": return new e(new Ki(60, 179, 113, 1));
						case "mediumslateblue": return new e(new Ki(123, 104, 238, 1));
						case "mediumspringgreen": return new e(new Ki(0, 250, 154, 1));
						case "mediumturquoise": return new e(new Ki(72, 209, 204, 1));
						case "mediumvioletred": return new e(new Ki(199, 21, 133, 1));
						case "midnightblue": return new e(new Ki(25, 25, 112, 1));
						case "mintcream": return new e(new Ki(245, 255, 250, 1));
						case "mistyrose": return new e(new Ki(255, 228, 225, 1));
						case "moccasin": return new e(new Ki(255, 228, 181, 1));
						case "navajowhite": return new e(new Ki(255, 222, 173, 1));
						case "navy": return new e(new Ki(0, 0, 128, 1));
						case "oldlace": return new e(new Ki(253, 245, 230, 1));
						case "olive": return new e(new Ki(128, 128, 0, 1));
						case "olivedrab": return new e(new Ki(107, 142, 35, 1));
						case "orange": return new e(new Ki(255, 165, 0, 1));
						case "orangered": return new e(new Ki(255, 69, 0, 1));
						case "orchid": return new e(new Ki(218, 112, 214, 1));
						case "palegoldenrod": return new e(new Ki(238, 232, 170, 1));
						case "palegreen": return new e(new Ki(152, 251, 152, 1));
						case "paleturquoise": return new e(new Ki(175, 238, 238, 1));
						case "palevioletred": return new e(new Ki(219, 112, 147, 1));
						case "papayawhip": return new e(new Ki(255, 239, 213, 1));
						case "peachpuff": return new e(new Ki(255, 218, 185, 1));
						case "peru": return new e(new Ki(205, 133, 63, 1));
						case "pink": return new e(new Ki(255, 192, 203, 1));
						case "plum": return new e(new Ki(221, 160, 221, 1));
						case "powderblue": return new e(new Ki(176, 224, 230, 1));
						case "purple": return new e(new Ki(128, 0, 128, 1));
						case "rebeccapurple": return new e(new Ki(102, 51, 153, 1));
						case "red": return new e(new Ki(255, 0, 0, 1));
						case "rosybrown": return new e(new Ki(188, 143, 143, 1));
						case "royalblue": return new e(new Ki(65, 105, 225, 1));
						case "saddlebrown": return new e(new Ki(139, 69, 19, 1));
						case "salmon": return new e(new Ki(250, 128, 114, 1));
						case "sandybrown": return new e(new Ki(244, 164, 96, 1));
						case "seagreen": return new e(new Ki(46, 139, 87, 1));
						case "seashell": return new e(new Ki(255, 245, 238, 1));
						case "sienna": return new e(new Ki(160, 82, 45, 1));
						case "silver": return new e(new Ki(192, 192, 192, 1));
						case "skyblue": return new e(new Ki(135, 206, 235, 1));
						case "slateblue": return new e(new Ki(106, 90, 205, 1));
						case "slategray":
						case "slategrey": return new e(new Ki(112, 128, 144, 1));
						case "snow": return new e(new Ki(255, 250, 250, 1));
						case "springgreen": return new e(new Ki(0, 255, 127, 1));
						case "steelblue": return new e(new Ki(70, 130, 180, 1));
						case "tan": return new e(new Ki(210, 180, 140, 1));
						case "teal": return new e(new Ki(0, 128, 128, 1));
						case "thistle": return new e(new Ki(216, 191, 216, 1));
						case "tomato": return new e(new Ki(255, 99, 71, 1));
						case "turquoise": return new e(new Ki(64, 224, 208, 1));
						case "violet": return new e(new Ki(238, 130, 238, 1));
						case "wheat": return new e(new Ki(245, 222, 179, 1));
						case "white": return new e(new Ki(255, 255, 255, 1));
						case "whitesmoke": return new e(new Ki(245, 245, 245, 1));
						case "yellow": return new e(new Ki(255, 255, 0, 1));
						case "yellowgreen": return new e(new Ki(154, 205, 50, 1));
						default: return null;
					}
				}(t);
			}, t.parseHex = r;
		})((t = e.Format || (e.Format = {})).CSS || (t.CSS = {}));
	})(Ui || (Ui = {}));
	const Zi = /^-+|-+$/g, Yi = 100;
	function es(e, t) {
		let n = [];
		if (t.findRegionSectionHeaders && t.foldingRules?.markers) {
			const r = function(e, t) {
				const n = [], r = e.getLineCount();
				for (let i = 1; i <= r; i++) {
					const r = e.getLineContent(i), s = r.match(t.foldingRules.markers.start);
					if (s) {
						const e = {
							startLineNumber: i,
							startColumn: s[0].length + 1,
							endLineNumber: i,
							endColumn: r.length + 1
						};
						if (e.endColumn > e.startColumn) {
							const t = {
								range: e,
								...ts(r.substring(s[0].length)),
								shouldBeInComments: !1
							};
							(t.text || t.hasSeparatorLine) && n.push(t);
						}
					}
				}
				return n;
			}(e, t);
			n = n.concat(r);
		}
		if (t.findMarkSectionHeaders) {
			const r = function(e, t) {
				const n = [], r = e.getLineCount();
				if (!t.markSectionHeaderRegex || "" === t.markSectionHeaderRegex.trim()) return n;
				const i = function(e) {
					if (!e || 0 === e.length) return !1;
					for (let t = 0, n = e.length; t < n; t++) {
						const r = e.charCodeAt(t);
						if (10 === r) return !0;
						if (92 === r) {
							if (t++, t >= n) break;
							const r = e.charCodeAt(t);
							if (110 === r || 114 === r || 87 === r) return !0;
						}
					}
					return !1;
				}(t.markSectionHeaderRegex), s = new RegExp(t.markSectionHeaderRegex, "gdm" + (i ? "s" : ""));
				if (o = s, "^" !== o.source && "^$" !== o.source && "$" !== o.source && "^\\s*$" !== o.source && o.exec("") && 0 === o.lastIndex) return n;
				var o;
				for (let a = 1; a <= r; a += 95) {
					const t = Math.min(a + Yi - 1, r), i = [];
					for (let n = a; n <= t; n++) i.push(e.getLineContent(n));
					const o = i.join("\n");
					let l;
					for (s.lastIndex = 0; null !== (l = s.exec(o));) {
						const e = o.substring(0, l.index), t = a + (e.match(/\n/g) || []).length, r = l[0].split("\n"), i = r.length, u = t + i - 1, c = e.lastIndexOf("\n") + 1, h = l.index - c + 1, d = r[r.length - 1], f = {
							range: {
								startLineNumber: t,
								startColumn: h,
								endLineNumber: u,
								endColumn: 1 === i ? h + l[0].length : d.length + 1
							},
							text: (l.groups ?? {}).label ?? "",
							hasSeparatorLine: "" !== ((l.groups ?? {}).separator ?? ""),
							shouldBeInComments: !0
						};
						(f.text || f.hasSeparatorLine) && (0 === n.length || n[n.length - 1].range.endLineNumber < f.range.startLineNumber) && n.push(f), s.lastIndex = l.index + l[0].length;
					}
				}
				return n;
			}(e, t);
			n = n.concat(r);
		}
		return n;
	}
	function ts(e) {
		const t = (e = e.trim()).startsWith("-");
		return {
			text: e = e.replace(Zi, ""),
			hasSeparatorLine: t
		};
	}
	(function() {
		const e = globalThis;
		"function" != typeof e.requestIdleCallback || e.cancelIdleCallback;
	})();
	var is, ss = class {
		get isRejected() {
			return 1 === this.outcome?.outcome;
		}
		get isSettled() {
			return !!this.outcome;
		}
		constructor() {
			this.p = new Promise((e, t) => {
				this.completeCallback = e, this.errorCallback = t;
			});
		}
		complete(e) {
			return this.isSettled ? Promise.resolve() : new Promise((t) => {
				this.completeCallback(e), this.outcome = {
					outcome: 0,
					value: e
				}, t();
			});
		}
		error(e) {
			return this.isSettled ? Promise.resolve() : new Promise((t) => {
				this.errorCallback(e), this.outcome = {
					outcome: 1,
					value: e
				}, t();
			});
		}
		cancel() {
			return this.error(new i());
		}
	};
	(function(e) {
		e.settled = async function(e) {
			let t;
			const n = await Promise.all(e.map((e) => e.then((e) => e, (e) => {
				t || (t = e);
			})));
			if (void 0 !== t) throw t;
			return n;
		}, e.withAsyncBody = function(e) {
			return new Promise(async (t, n) => {
				try {
					await e(t, n);
				} catch (r) {
					n(r);
				}
			});
		};
	})(is || (is = {}));
	var os = class {
		constructor() {
			this._unsatisfiedConsumers = [], this._unconsumedValues = [];
		}
		get hasFinalValue() {
			return !!this._finalValue;
		}
		produce(e) {
			if (this._ensureNoFinalValue(), this._unsatisfiedConsumers.length > 0) {
				const t = this._unsatisfiedConsumers.shift();
				this._resolveOrRejectDeferred(t, e);
			} else this._unconsumedValues.push(e);
		}
		produceFinal(e) {
			this._ensureNoFinalValue(), this._finalValue = e;
			for (const t of this._unsatisfiedConsumers) this._resolveOrRejectDeferred(t, e);
			this._unsatisfiedConsumers.length = 0;
		}
		_ensureNoFinalValue() {
			if (this._finalValue) throw new o("ProducerConsumer: cannot produce after final value has been set");
		}
		_resolveOrRejectDeferred(e, t) {
			t.ok ? e.complete(t.value) : e.error(t.error);
		}
		consume() {
			if (this._unconsumedValues.length > 0 || this._finalValue) {
				const e = this._unconsumedValues.length > 0 ? this._unconsumedValues.shift() : this._finalValue;
				return e.ok ? Promise.resolve(e.value) : Promise.reject(e.error);
			}
			{
				const e = new ss();
				return this._unsatisfiedConsumers.push(e), e.p;
			}
		}
	}, as = (class e {
		constructor(e, t) {
			this._onReturn = t, this._producerConsumer = new os(), this._iterator = {
				next: () => this._producerConsumer.consume(),
				return: () => (this._onReturn?.(), Promise.resolve({
					done: !0,
					value: void 0
				})),
				throw: async (e) => (this._finishError(e), {
					done: !0,
					value: void 0
				})
			}, queueMicrotask(async () => {
				const t = e({
					emitOne: (e) => this._producerConsumer.produce({
						ok: !0,
						value: {
							done: !1,
							value: e
						}
					}),
					emitMany: (e) => {
						for (const t of e) this._producerConsumer.produce({
							ok: !0,
							value: {
								done: !1,
								value: t
							}
						});
					},
					reject: (e) => this._finishError(e)
				});
				if (!this._producerConsumer.hasFinalValue) try {
					await t, this._finishOk();
				} catch (n) {
					this._finishError(n);
				}
			});
		}
		static fromArray(t) {
			return new e((e) => {
				e.emitMany(t);
			});
		}
		static fromPromise(t) {
			return new e(async (e) => {
				e.emitMany(await t);
			});
		}
		static fromPromisesResolveOrder(t) {
			return new e(async (e) => {
				await Promise.all(t.map(async (t) => e.emitOne(await t)));
			});
		}
		static merge(t) {
			return new e(async (e) => {
				await Promise.all(t.map(async (t) => {
					for await (const n of t) e.emitOne(n);
				}));
			});
		}
		static {
			this.EMPTY = e.fromArray([]);
		}
		static map(t, n) {
			return new e(async (e) => {
				for await (const r of t) e.emitOne(n(r));
			});
		}
		map(t) {
			return e.map(this, t);
		}
		static coalesce(t) {
			return e.filter(t, (e) => !!e);
		}
		coalesce() {
			return e.coalesce(this);
		}
		static filter(t, n) {
			return new e(async (e) => {
				for await (const r of t) n(r) && e.emitOne(r);
			});
		}
		filter(t) {
			return e.filter(this, t);
		}
		_finishOk() {
			this._producerConsumer.hasFinalValue || this._producerConsumer.produceFinal({
				ok: !0,
				value: {
					done: !0,
					value: void 0
				}
			});
		}
		_finishError(e) {
			this._producerConsumer.hasFinalValue || this._producerConsumer.produceFinal({
				ok: !1,
				error: e
			});
		}
		[Symbol.asyncIterator]() {
			return this._iterator;
		}
	}, class {
		constructor(e) {
			this.values = e, this.prefixSum = new Uint32Array(e.length), this.prefixSumValidIndex = new Int32Array(1), this.prefixSumValidIndex[0] = -1;
		}
		insertValues(e, t) {
			e = Ke(e);
			const n = this.values, r = this.prefixSum, i = t.length;
			return 0 !== i && (this.values = new Uint32Array(n.length + i), this.values.set(n.subarray(0, e), 0), this.values.set(n.subarray(e), e + i), this.values.set(t, e), e - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = e - 1), this.prefixSum = new Uint32Array(this.values.length), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(r.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
		}
		setValue(e, t) {
			return e = Ke(e), t = Ke(t), this.values[e] !== t && (this.values[e] = t, e - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = e - 1), !0);
		}
		removeValues(e, t) {
			e = Ke(e), t = Ke(t);
			const n = this.values, r = this.prefixSum;
			if (e >= n.length) return !1;
			const i = n.length - e;
			return t >= i && (t = i), 0 !== t && (this.values = new Uint32Array(n.length - t), this.values.set(n.subarray(0, e), 0), this.values.set(n.subarray(e + t), e), this.prefixSum = new Uint32Array(this.values.length), e - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = e - 1), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(r.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
		}
		getTotalSum() {
			return 0 === this.values.length ? 0 : this._getPrefixSum(this.values.length - 1);
		}
		getPrefixSum(e) {
			return e < 0 ? 0 : (e = Ke(e), this._getPrefixSum(e));
		}
		_getPrefixSum(e) {
			if (e <= this.prefixSumValidIndex[0]) return this.prefixSum[e];
			let t = this.prefixSumValidIndex[0] + 1;
			0 === t && (this.prefixSum[0] = this.values[0], t++), e >= this.values.length && (e = this.values.length - 1);
			for (let n = t; n <= e; n++) this.prefixSum[n] = this.prefixSum[n - 1] + this.values[n];
			return this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], e), this.prefixSum[e];
		}
		getIndexOf(e) {
			e = Math.floor(e), this.getTotalSum();
			let t = 0, n = this.values.length - 1, r = 0, i = 0, s = 0;
			for (; t <= n;) if (r = t + (n - t) / 2 | 0, i = this.prefixSum[r], s = i - this.values[r], e < s) n = r - 1;
			else {
				if (!(e >= i)) break;
				t = r + 1;
			}
			return new ls(r, e - s);
		}
	}), ls = class {
		constructor(e, t) {
			this.index = e, this.remainder = t, this._prefixSumIndexOfResultBrand = void 0, this.index = e, this.remainder = t;
		}
	}, us = class {
		constructor(e, t, n, r) {
			this._uri = e, this._lines = t, this._eol = n, this._versionId = r, this._lineStarts = null, this._cachedTextValue = null;
		}
		dispose() {
			this._lines.length = 0;
		}
		get version() {
			return this._versionId;
		}
		getText() {
			return null === this._cachedTextValue && (this._cachedTextValue = this._lines.join(this._eol)), this._cachedTextValue;
		}
		onEvents(e) {
			e.eol && e.eol !== this._eol && (this._eol = e.eol, this._lineStarts = null);
			const t = e.changes;
			for (const n of t) this._acceptDeleteRange(n.range), this._acceptInsertText(new Fe(n.range.startLineNumber, n.range.startColumn), n.text);
			this._versionId = e.versionId, this._cachedTextValue = null;
		}
		_ensureLineStarts() {
			if (!this._lineStarts) {
				const e = this._eol.length, t = this._lines.length, n = new Uint32Array(t);
				for (let r = 0; r < t; r++) n[r] = this._lines[r].length + e;
				this._lineStarts = new as(n);
			}
		}
		_setLineText(e, t) {
			this._lines[e] = t, this._lineStarts && this._lineStarts.setValue(e, this._lines[e].length + this._eol.length);
		}
		_acceptDeleteRange(e) {
			if (e.startLineNumber !== e.endLineNumber) this._setLineText(e.startLineNumber - 1, this._lines[e.startLineNumber - 1].substring(0, e.startColumn - 1) + this._lines[e.endLineNumber - 1].substring(e.endColumn - 1)), this._lines.splice(e.startLineNumber, e.endLineNumber - e.startLineNumber), this._lineStarts && this._lineStarts.removeValues(e.startLineNumber, e.endLineNumber - e.startLineNumber);
			else {
				if (e.startColumn === e.endColumn) return;
				this._setLineText(e.startLineNumber - 1, this._lines[e.startLineNumber - 1].substring(0, e.startColumn - 1) + this._lines[e.startLineNumber - 1].substring(e.endColumn - 1));
			}
		}
		_acceptInsertText(e, t) {
			if (0 === t.length) return;
			const n = t.split(/\r\n|\r|\n/);
			if (1 === n.length) return void this._setLineText(e.lineNumber - 1, this._lines[e.lineNumber - 1].substring(0, e.column - 1) + n[0] + this._lines[e.lineNumber - 1].substring(e.column - 1));
			n[n.length - 1] += this._lines[e.lineNumber - 1].substring(e.column - 1), this._setLineText(e.lineNumber - 1, this._lines[e.lineNumber - 1].substring(0, e.column - 1) + n[0]);
			const r = new Uint32Array(n.length - 1);
			for (let i = 1; i < n.length; i++) this._lines.splice(e.lineNumber + i - 1, 0, n[i]), r[i - 1] = n[i].length + this._eol.length;
			this._lineStarts && this._lineStarts.insertValues(e.lineNumber, r);
		}
	}, cs = class {
		constructor() {
			this._models = Object.create(null);
		}
		getModel(e) {
			return this._models[e];
		}
		getModels() {
			const e = [];
			return Object.keys(this._models).forEach((t) => e.push(this._models[t])), e;
		}
		$acceptNewModel(e) {
			this._models[e.url] = new hs(Ot.parse(e.url), e.lines, e.EOL, e.versionId);
		}
		$acceptModelChanged(e, t) {
			this._models[e] && this._models[e].onEvents(t);
		}
		$acceptRemovedModel(e) {
			this._models[e] && delete this._models[e];
		}
	}, hs = class extends us {
		get uri() {
			return this._uri;
		}
		get eol() {
			return this._eol;
		}
		getValue() {
			return this.getText();
		}
		findMatches(e) {
			const t = [];
			for (let n = 0; n < this._lines.length; n++) {
				const r = this._lines[n], i = this.offsetAt(new Fe(n + 1, 1)), s = r.matchAll(e);
				for (const e of s) (e.index || 0 === e.index) && (e.index = e.index + i), t.push(e);
			}
			return t;
		}
		getLinesContent() {
			return this._lines.slice(0);
		}
		getLineCount() {
			return this._lines.length;
		}
		getLineContent(e) {
			return this._lines[e - 1];
		}
		getWordAtPosition(e, t) {
			const n = Cr(e.column, wr(t), this._lines[e.lineNumber - 1], 0);
			return n ? new De(e.lineNumber, n.startColumn, e.lineNumber, n.endColumn) : null;
		}
		words(e) {
			const t = this._lines, n = this._wordenize.bind(this);
			let r = 0, i = "", s = 0, o = [];
			return { *[Symbol.iterator]() {
				for (;;) if (s < o.length) {
					const e = i.substring(o[s].start, o[s].end);
					s += 1, yield e;
				} else {
					if (!(r < t.length)) break;
					i = t[r], o = n(i, e), s = 0, r += 1;
				}
			} };
		}
		getLineWords(e, t) {
			const n = this._lines[e - 1], r = this._wordenize(n, t), i = [];
			for (const s of r) i.push({
				word: n.substring(s.start, s.end),
				startColumn: s.start + 1,
				endColumn: s.end + 1
			});
			return i;
		}
		_wordenize(e, t) {
			const n = [];
			let r;
			for (t.lastIndex = 0; (r = t.exec(e)) && 0 !== r[0].length;) n.push({
				start: r.index,
				end: r.index + r[0].length
			});
			return n;
		}
		getValueInRange(e) {
			if ((e = this._validateRange(e)).startLineNumber === e.endLineNumber) return this._lines[e.startLineNumber - 1].substring(e.startColumn - 1, e.endColumn - 1);
			const t = this._eol, n = e.startLineNumber - 1, r = e.endLineNumber - 1, i = [];
			i.push(this._lines[n].substring(e.startColumn - 1));
			for (let s = n + 1; s < r; s++) i.push(this._lines[s]);
			return i.push(this._lines[r].substring(0, e.endColumn - 1)), i.join(t);
		}
		offsetAt(e) {
			return e = this._validatePosition(e), this._ensureLineStarts(), this._lineStarts.getPrefixSum(e.lineNumber - 2) + (e.column - 1);
		}
		positionAt(e) {
			e = Math.floor(e), e = Math.max(0, e), this._ensureLineStarts();
			const t = this._lineStarts.getIndexOf(e), n = this._lines[t.index].length;
			return {
				lineNumber: 1 + t.index,
				column: 1 + Math.min(t.remainder, n)
			};
		}
		_validateRange(e) {
			const t = this._validatePosition({
				lineNumber: e.startLineNumber,
				column: e.startColumn
			}), n = this._validatePosition({
				lineNumber: e.endLineNumber,
				column: e.endColumn
			});
			return t.lineNumber !== e.startLineNumber || t.column !== e.startColumn || n.lineNumber !== e.endLineNumber || n.column !== e.endColumn ? {
				startLineNumber: t.lineNumber,
				startColumn: t.column,
				endLineNumber: n.lineNumber,
				endColumn: n.column
			} : e;
		}
		_validatePosition(e) {
			if (!Fe.isIPosition(e)) throw new Error("bad position");
			let { lineNumber: t, column: n } = e, r = !1;
			if (t < 1) t = 1, n = 1, r = !0;
			else if (t > this._lines.length) t = this._lines.length, n = this._lines[t - 1].length + 1, r = !0;
			else {
				const e = this._lines[t - 1].length + 1;
				n < 1 ? (n = 1, r = !0) : n > e && (n = e, r = !0);
			}
			return r ? {
				lineNumber: t,
				column: n
			} : e;
		}
	}, ds = class e {
		constructor(e = null) {
			this._foreignModule = e, this._requestHandlerBrand = void 0, this._workerTextModelSyncServer = new cs();
		}
		dispose() {}
		async $ping() {
			return "pong";
		}
		_getModel(e) {
			return this._workerTextModelSyncServer.getModel(e);
		}
		getModels() {
			return this._workerTextModelSyncServer.getModels();
		}
		$acceptNewModel(e) {
			this._workerTextModelSyncServer.$acceptNewModel(e);
		}
		$acceptModelChanged(e, t) {
			this._workerTextModelSyncServer.$acceptModelChanged(e, t);
		}
		$acceptRemovedModel(e) {
			this._workerTextModelSyncServer.$acceptRemovedModel(e);
		}
		async $computeUnicodeHighlights(e, t, n) {
			const r = this._getModel(e);
			return r ? Lr.computeUnicodeHighlights(r, t, n) : {
				ranges: [],
				hasMore: !1,
				ambiguousCharacterCount: 0,
				invisibleCharacterCount: 0,
				nonBasicAsciiCharacterCount: 0
			};
		}
		async $findSectionHeaders(e, t) {
			const n = this._getModel(e);
			return n ? es(n, t) : [];
		}
		async $computeDiff(t, n, r, i) {
			const s = this._getModel(t), o = this._getModel(n);
			return s && o ? e.computeDiff(s, o, r, i) : null;
		}
		static computeDiff(e, t, n, r) {
			const i = "advanced" === r ? Di() : Fi(), s = e.getLinesContent(), o = t.getLinesContent(), a = i.computeDiff(s, o, n);
			function l(e) {
				return e.map((e) => [
					e.original.startLineNumber,
					e.original.endLineNumberExclusive,
					e.modified.startLineNumber,
					e.modified.endLineNumberExclusive,
					e.innerChanges?.map((e) => [
						e.originalRange.startLineNumber,
						e.originalRange.startColumn,
						e.originalRange.endLineNumber,
						e.originalRange.endColumn,
						e.modifiedRange.startLineNumber,
						e.modifiedRange.startColumn,
						e.modifiedRange.endLineNumber,
						e.modifiedRange.endColumn
					])
				]);
			}
			return {
				identical: !(a.changes.length > 0) && this._modelsAreIdentical(e, t),
				quitEarly: a.hitTimeout,
				changes: l(a.changes),
				moves: a.moves.map((e) => [
					e.lineRangeMapping.original.startLineNumber,
					e.lineRangeMapping.original.endLineNumberExclusive,
					e.lineRangeMapping.modified.startLineNumber,
					e.lineRangeMapping.modified.endLineNumberExclusive,
					l(e.changes)
				])
			};
		}
		static _modelsAreIdentical(e, t) {
			const n = e.getLineCount();
			if (n !== t.getLineCount()) return !1;
			for (let r = 1; r <= n; r++) if (e.getLineContent(r) !== t.getLineContent(r)) return !1;
			return !0;
		}
		static {
			this._diffLimit = 1e5;
		}
		async $computeMoreMinimalEdits(t, n, r) {
			const i = this._getModel(t);
			if (!i) return n;
			const s = [];
			let o;
			n = n.slice(0).sort((e, t) => e.range && t.range ? De.compareRangesUsingStarts(e.range, t.range) : (e.range ? 0 : 1) - (t.range ? 0 : 1));
			let a = 0;
			for (let e = 1; e < n.length; e++) De.getEndPosition(n[a].range).equals(De.getStartPosition(n[e].range)) ? (n[a].range = De.fromPositions(De.getStartPosition(n[a].range), De.getEndPosition(n[e].range)), n[a].text += n[e].text) : (a++, n[a] = n[e]);
			n.length = a + 1;
			for (let { range: l, text: u, eol: c } of n) {
				if ("number" == typeof c && (o = c), De.isEmpty(l) && !u) continue;
				const t = i.getValueInRange(l);
				if (u = u.replace(/\r\n|\n|\r/g, i.eol), t === u) continue;
				if (Math.max(u.length, t.length) > e._diffLimit) {
					s.push({
						range: l,
						text: u
					});
					continue;
				}
				const n = Me(t, u, r), a = i.offsetAt(De.lift(l).getStartPosition());
				for (const e of n) {
					const t = i.positionAt(a + e.originalStart), n = i.positionAt(a + e.originalStart + e.originalLength), r = {
						text: u.substr(e.modifiedStart, e.modifiedLength),
						range: {
							startLineNumber: t.lineNumber,
							startColumn: t.column,
							endLineNumber: n.lineNumber,
							endColumn: n.column
						}
					};
					i.getValueInRange(r.range) !== r.text && s.push(r);
				}
			}
			return "number" == typeof o && s.push({
				eol: o,
				text: "",
				range: {
					startLineNumber: 0,
					startColumn: 0,
					endLineNumber: 0,
					endColumn: 0
				}
			}), s;
		}
		async $computeLinks(e) {
			const t = this._getModel(e);
			return t ? function(e) {
				return e && "function" == typeof e.getLineCount && "function" == typeof e.getLineContent ? ze.computeLinks(e) : [];
			}(t) : null;
		}
		async $computeDefaultDocumentColors(e) {
			const t = this._getModel(e);
			return t ? Qi(t) : null;
		}
		static {
			this._suggestionsLimit = 1e4;
		}
		async $textualSuggest(t, n, r, i) {
			const s = new w(), o = new RegExp(r, i), a = /* @__PURE__ */ new Set();
			e: for (const l of t) {
				const t = this._getModel(l);
				if (t) {
					for (const r of t.words(o)) if (r !== n && isNaN(Number(r)) && (a.add(r), a.size > e._suggestionsLimit)) break e;
				}
			}
			return {
				words: Array.from(a),
				duration: s.elapsed()
			};
		}
		async $computeWordRanges(e, t, n, r) {
			const i = this._getModel(e);
			if (!i) return Object.create(null);
			const s = new RegExp(n, r), o = Object.create(null);
			for (let a = t.startLineNumber; a < t.endLineNumber; a++) {
				const e = i.getLineWords(a, s);
				for (const t of e) {
					if (!isNaN(Number(t.word))) continue;
					let e = o[t.word];
					e || (e = [], o[t.word] = e), e.push({
						startLineNumber: a,
						startColumn: t.startColumn,
						endLineNumber: a,
						endColumn: t.endColumn
					});
				}
			}
			return o;
		}
		async $navigateValueSet(e, t, n, r, i) {
			const s = this._getModel(e);
			if (!s) return null;
			const o = new RegExp(r, i);
			t.startColumn === t.endColumn && (t = {
				startLineNumber: t.startLineNumber,
				startColumn: t.startColumn,
				endLineNumber: t.endLineNumber,
				endColumn: t.endColumn + 1
			});
			const a = s.getValueInRange(t), l = s.getWordAtPosition({
				lineNumber: t.startLineNumber,
				column: t.startColumn
			}, o);
			if (!l) return null;
			const u = s.getValueInRange(l);
			return He.INSTANCE.navigateValueSet(t, a, l, u, n);
		}
		$fmr(e, t) {
			if (!this._foreignModule || "function" != typeof this._foreignModule[e]) return Promise.reject(/* @__PURE__ */ new Error("Missing requestHandler or method: " + e));
			try {
				return Promise.resolve(this._foreignModule[e].apply(this._foreignModule, t));
			} catch (Jl) {
				return Promise.reject(Jl);
			}
		}
	};
	"function" == typeof importScripts && (globalThis.monaco = {
		editor: void 0,
		languages: void 0,
		CancellationTokenSource: Qe,
		Emitter: E,
		KeyCode: Mn,
		KeyMod: ar,
		Position: Fe,
		Range: De,
		Selection: jt,
		SelectionDirection: Gn,
		MarkerSeverity: On,
		MarkerTag: In,
		Uri: Ot,
		Token: rn
	});
	var fs = class e {
		static {
			this.CHANNEL_NAME = "editorWorkerHost";
		}
		static getChannel(t) {
			return t.getChannel(e.CHANNEL_NAME);
		}
		static setChannel(t, n) {
			t.setChannel(e.CHANNEL_NAME, n);
		}
	};
	function ms(e) {
		let t;
		const n = function(e) {
			if (_e) throw new Error("WebWorker already initialized!");
			_e = !0;
			const t = new we((e) => globalThis.postMessage(e), (t) => e(t));
			return globalThis.onmessage = (e) => {
				t.onmessage(e.data);
			}, t;
		}((r) => {
			const i = fs.getChannel(r);
			return t = e({
				host: new Proxy({}, { get(e, t, n) {
					if ("then" !== t) {
						if ("string" != typeof t) throw new Error("Not supported");
						return (...e) => i.$fhr(t, e);
					}
				} }),
				getMirrorModels: () => n.requestHandler.getModels()
			}), new ds(t);
		});
		return t;
	}
	function ps(e, t = !1) {
		const n = e.length;
		let r = 0, i = "", s = 0, o = 16, a = 0, l = 0, u = 0, c = 0, h = 0;
		function d(t, n) {
			let i = 0, s = 0;
			for (; i < t;) {
				let t = e.charCodeAt(r);
				if (t >= 48 && t <= 57) s = 16 * s + t - 48;
				else if (t >= 65 && t <= 70) s = 16 * s + t - 65 + 10;
				else {
					if (!(t >= 97 && t <= 102)) break;
					s = 16 * s + t - 97 + 10;
				}
				r++, i++;
			}
			return i < t && (s = -1), s;
		}
		function f() {
			if (i = "", h = 0, s = r, l = a, c = u, r >= n) return s = n, o = 17;
			let t = e.charCodeAt(r);
			if (bs(t)) {
				do
					r++, i += String.fromCharCode(t), t = e.charCodeAt(r);
				while (bs(t));
				return o = 15;
			}
			if (ys(t)) return r++, i += String.fromCharCode(t), 13 === t && 10 === e.charCodeAt(r) && (r++, i += "\n"), a++, u = r, o = 14;
			switch (t) {
				case 123: return r++, o = 1;
				case 125: return r++, o = 2;
				case 91: return r++, o = 3;
				case 93: return r++, o = 4;
				case 58: return r++, o = 6;
				case 44: return r++, o = 5;
				case 34: return r++, i = function() {
					let t = "", i = r;
					for (;;) {
						if (r >= n) {
							t += e.substring(i, r), h = 2;
							break;
						}
						const s = e.charCodeAt(r);
						if (34 === s) {
							t += e.substring(i, r), r++;
							break;
						}
						if (92 !== s) {
							if (s >= 0 && s <= 31) {
								if (ys(s)) {
									t += e.substring(i, r), h = 2;
									break;
								}
								h = 6;
							}
							r++;
						} else {
							if (t += e.substring(i, r), r++, r >= n) {
								h = 2;
								break;
							}
							switch (e.charCodeAt(r++)) {
								case 34:
									t += "\"";
									break;
								case 92:
									t += "\\";
									break;
								case 47:
									t += "/";
									break;
								case 98:
									t += "\b";
									break;
								case 102:
									t += "\f";
									break;
								case 110:
									t += "\n";
									break;
								case 114:
									t += "\r";
									break;
								case 116:
									t += "	";
									break;
								case 117:
									const e = d(4);
									e >= 0 ? t += String.fromCharCode(e) : h = 4;
									break;
								default: h = 5;
							}
							i = r;
						}
					}
					return t;
				}(), o = 10;
				case 47:
					const l = r - 1;
					if (47 === e.charCodeAt(r + 1)) {
						for (r += 2; r < n && !ys(e.charCodeAt(r));) r++;
						return i = e.substring(l, r), o = 12;
					}
					if (42 === e.charCodeAt(r + 1)) {
						r += 2;
						const t = n - 1;
						let s = !1;
						for (; r < t;) {
							const t = e.charCodeAt(r);
							if (42 === t && 47 === e.charCodeAt(r + 1)) {
								r += 2, s = !0;
								break;
							}
							r++, ys(t) && (13 === t && 10 === e.charCodeAt(r) && r++, a++, u = r);
						}
						return s || (r++, h = 1), i = e.substring(l, r), o = 13;
					}
					return i += String.fromCharCode(t), r++, o = 16;
				case 45: if (i += String.fromCharCode(t), r++, r === n || !vs(e.charCodeAt(r))) return o = 16;
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57: return i += function() {
					let t = r;
					if (48 === e.charCodeAt(r)) r++;
					else for (r++; r < e.length && vs(e.charCodeAt(r));) r++;
					if (r < e.length && 46 === e.charCodeAt(r)) {
						if (r++, !(r < e.length && vs(e.charCodeAt(r)))) return h = 3, e.substring(t, r);
						for (r++; r < e.length && vs(e.charCodeAt(r));) r++;
					}
					let n = r;
					if (r < e.length && (69 === e.charCodeAt(r) || 101 === e.charCodeAt(r))) if (r++, (r < e.length && 43 === e.charCodeAt(r) || 45 === e.charCodeAt(r)) && r++, r < e.length && vs(e.charCodeAt(r))) {
						for (r++; r < e.length && vs(e.charCodeAt(r));) r++;
						n = r;
					} else h = 3;
					return e.substring(t, n);
				}(), o = 11;
				default:
					for (; r < n && m(t);) r++, t = e.charCodeAt(r);
					if (s !== r) {
						switch (i = e.substring(s, r), i) {
							case "true": return o = 8;
							case "false": return o = 9;
							case "null": return o = 7;
						}
						return o = 16;
					}
					return i += String.fromCharCode(t), r++, o = 16;
			}
		}
		function m(e) {
			if (bs(e) || ys(e)) return !1;
			switch (e) {
				case 125:
				case 93:
				case 123:
				case 91:
				case 34:
				case 58:
				case 44:
				case 47: return !1;
			}
			return !0;
		}
		return {
			setPosition: function(e) {
				r = e, i = "", s = 0, o = 16, h = 0;
			},
			getPosition: () => r,
			scan: t ? function() {
				let e;
				do
					e = f();
				while (e >= 12 && e <= 15);
				return e;
			} : f,
			getToken: () => o,
			getTokenValue: () => i,
			getTokenOffset: () => s,
			getTokenLength: () => r - s,
			getTokenStartLine: () => l,
			getTokenStartCharacter: () => s - c,
			getTokenError: () => h
		};
	}
	function bs(e) {
		return 32 === e || 9 === e;
	}
	function ys(e) {
		return 10 === e || 13 === e;
	}
	function vs(e) {
		return e >= 48 && e <= 57;
	}
	var ws;
	(function(e) {
		e[e.lineFeed = 10] = "lineFeed", e[e.carriageReturn = 13] = "carriageReturn", e[e.space = 32] = "space", e[e._0 = 48] = "_0", e[e._1 = 49] = "_1", e[e._2 = 50] = "_2", e[e._3 = 51] = "_3", e[e._4 = 52] = "_4", e[e._5 = 53] = "_5", e[e._6 = 54] = "_6", e[e._7 = 55] = "_7", e[e._8 = 56] = "_8", e[e._9 = 57] = "_9", e[e.a = 97] = "a", e[e.b = 98] = "b", e[e.c = 99] = "c", e[e.d = 100] = "d", e[e.e = 101] = "e", e[e.f = 102] = "f", e[e.g = 103] = "g", e[e.h = 104] = "h", e[e.i = 105] = "i", e[e.j = 106] = "j", e[e.k = 107] = "k", e[e.l = 108] = "l", e[e.m = 109] = "m", e[e.n = 110] = "n", e[e.o = 111] = "o", e[e.p = 112] = "p", e[e.q = 113] = "q", e[e.r = 114] = "r", e[e.s = 115] = "s", e[e.t = 116] = "t", e[e.u = 117] = "u", e[e.v = 118] = "v", e[e.w = 119] = "w", e[e.x = 120] = "x", e[e.y = 121] = "y", e[e.z = 122] = "z", e[e.A = 65] = "A", e[e.B = 66] = "B", e[e.C = 67] = "C", e[e.D = 68] = "D", e[e.E = 69] = "E", e[e.F = 70] = "F", e[e.G = 71] = "G", e[e.H = 72] = "H", e[e.I = 73] = "I", e[e.J = 74] = "J", e[e.K = 75] = "K", e[e.L = 76] = "L", e[e.M = 77] = "M", e[e.N = 78] = "N", e[e.O = 79] = "O", e[e.P = 80] = "P", e[e.Q = 81] = "Q", e[e.R = 82] = "R", e[e.S = 83] = "S", e[e.T = 84] = "T", e[e.U = 85] = "U", e[e.V = 86] = "V", e[e.W = 87] = "W", e[e.X = 88] = "X", e[e.Y = 89] = "Y", e[e.Z = 90] = "Z", e[e.asterisk = 42] = "asterisk", e[e.backslash = 92] = "backslash", e[e.closeBrace = 125] = "closeBrace", e[e.closeBracket = 93] = "closeBracket", e[e.colon = 58] = "colon", e[e.comma = 44] = "comma", e[e.dot = 46] = "dot", e[e.doubleQuote = 34] = "doubleQuote", e[e.minus = 45] = "minus", e[e.openBrace = 123] = "openBrace", e[e.openBracket = 91] = "openBracket", e[e.plus = 43] = "plus", e[e.slash = 47] = "slash", e[e.formFeed = 12] = "formFeed", e[e.tab = 9] = "tab";
	})(ws || (ws = {}));
	const _s = new Array(20).fill(0).map((e, t) => " ".repeat(t)), Cs = 200, Ss = {
		" ": {
			"\n": new Array(Cs).fill(0).map((e, t) => "\n" + " ".repeat(t)),
			"\r": new Array(Cs).fill(0).map((e, t) => "\r" + " ".repeat(t)),
			"\r\n": new Array(Cs).fill(0).map((e, t) => "\r\n" + " ".repeat(t))
		},
		"	": {
			"\n": new Array(Cs).fill(0).map((e, t) => "\n" + "	".repeat(t)),
			"\r": new Array(Cs).fill(0).map((e, t) => "\r" + "	".repeat(t)),
			"\r\n": new Array(Cs).fill(0).map((e, t) => "\r\n" + "	".repeat(t))
		}
	}, Ls = [
		"\n",
		"\r",
		"\r\n"
	];
	function Ns(e, t, n) {
		let r, i, s, o, a;
		if (t) {
			for (o = t.offset, a = o + t.length, s = o; s > 0 && !Es(e, s - 1);) s--;
			let l = a;
			for (; l < e.length && !Es(e, l);) l++;
			i = e.substring(s, l), r = function(e, t) {
				let n = 0, r = 0;
				const i = t.tabSize || 4;
				for (; n < e.length;) {
					let t = e.charAt(n);
					if (t === _s[1]) r++;
					else {
						if ("	" !== t) break;
						r += i;
					}
					n++;
				}
				return Math.floor(r / i);
			}(i, n);
		} else i = e, r = 0, s = 0, o = 0, a = e.length;
		const l = function(e, t) {
			for (let n = 0; n < t.length; n++) {
				const e = t.charAt(n);
				if ("\r" === e) return n + 1 < t.length && "\n" === t.charAt(n + 1) ? "\r\n" : "\r";
				if ("\n" === e) return "\n";
			}
			return e && e.eol || "\n";
		}(n, e), u = Ls.includes(l);
		let c, h = 0, d = 0;
		c = n.insertSpaces ? _s[n.tabSize || 4] ?? xs(_s[1], n.tabSize || 4) : "	";
		const f = "	" === c ? "	" : " ";
		let m = ps(i, !1), g = !1;
		function p() {
			if (h > 1) return xs(l, h) + xs(c, r + d);
			const e = c.length * (r + d);
			return !u || e > Ss[f][l].length ? l + xs(c, r + d) : e <= 0 ? l : Ss[f][l][e];
		}
		function b() {
			let e = m.scan();
			for (h = 0; 15 === e || 14 === e;) 14 === e && n.keepLines ? h += 1 : 14 === e && (h = 1), e = m.scan();
			return g = 16 === e || 0 !== m.getTokenError(), e;
		}
		const y = [];
		function v(n, r, i) {
			g || t && !(r < a && i > o) || e.substring(r, i) === n || y.push({
				offset: r,
				length: i - r,
				content: n
			});
		}
		let w = b();
		if (n.keepLines && h > 0 && v(xs(l, h), 0, 0), 17 !== w) {
			let e = m.getTokenOffset() + s;
			v(c.length * r < 20 && n.insertSpaces ? _s[c.length * r] : xs(c, r), s, e);
		}
		for (; 17 !== w;) {
			let e = m.getTokenOffset() + m.getTokenLength() + s, t = b(), r = "", i = !1;
			for (; 0 === h && (12 === t || 13 === t);) {
				let n = m.getTokenOffset() + s;
				v(_s[1], e, n), e = m.getTokenOffset() + m.getTokenLength() + s, i = 12 === t, r = i ? p() : "", t = b();
			}
			if (2 === t) 1 !== w && d--, n.keepLines && h > 0 || !n.keepLines && 1 !== w ? r = p() : n.keepLines && (r = _s[1]);
			else if (4 === t) 3 !== w && d--, n.keepLines && h > 0 || !n.keepLines && 3 !== w ? r = p() : n.keepLines && (r = _s[1]);
			else {
				switch (w) {
					case 3:
					case 1:
						d++, r = n.keepLines && h > 0 || !n.keepLines ? p() : _s[1];
						break;
					case 5:
						r = n.keepLines && h > 0 || !n.keepLines ? p() : _s[1];
						break;
					case 12:
						r = p();
						break;
					case 13:
						h > 0 ? r = p() : i || (r = _s[1]);
						break;
					case 6:
						n.keepLines && h > 0 ? r = p() : i || (r = _s[1]);
						break;
					case 10:
						n.keepLines && h > 0 ? r = p() : 6 !== t || i || (r = "");
						break;
					case 7:
					case 8:
					case 9:
					case 11:
					case 2:
					case 4:
						n.keepLines && h > 0 ? r = p() : 12 !== t && 13 !== t || i ? 5 !== t && 17 !== t && (g = !0) : r = _s[1];
						break;
					case 16: g = !0;
				}
				h > 0 && (12 === t || 13 === t) && (r = p());
			}
			17 === t && (r = n.keepLines && h > 0 ? p() : n.insertFinalNewline ? l : "");
			v(r, e, m.getTokenOffset() + s), w = t;
		}
		return y;
	}
	function xs(e, t) {
		let n = "";
		for (let r = 0; r < t; r++) n += e;
		return n;
	}
	function Es(e, t) {
		return -1 !== "\r\n".indexOf(e.charAt(t));
	}
	var As;
	(function(e) {
		e.DEFAULT = { allowTrailingComma: !1 };
	})(As || (As = {}));
	const ks = ps;
	var Rs, Ts;
	(function(e) {
		e[e.None = 0] = "None", e[e.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", e[e.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", e[e.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", e[e.InvalidUnicode = 4] = "InvalidUnicode", e[e.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", e[e.InvalidCharacter = 6] = "InvalidCharacter";
	})(Rs || (Rs = {})), function(e) {
		e[e.OpenBraceToken = 1] = "OpenBraceToken", e[e.CloseBraceToken = 2] = "CloseBraceToken", e[e.OpenBracketToken = 3] = "OpenBracketToken", e[e.CloseBracketToken = 4] = "CloseBracketToken", e[e.CommaToken = 5] = "CommaToken", e[e.ColonToken = 6] = "ColonToken", e[e.NullKeyword = 7] = "NullKeyword", e[e.TrueKeyword = 8] = "TrueKeyword", e[e.FalseKeyword = 9] = "FalseKeyword", e[e.StringLiteral = 10] = "StringLiteral", e[e.NumericLiteral = 11] = "NumericLiteral", e[e.LineCommentTrivia = 12] = "LineCommentTrivia", e[e.BlockCommentTrivia = 13] = "BlockCommentTrivia", e[e.LineBreakTrivia = 14] = "LineBreakTrivia", e[e.Trivia = 15] = "Trivia", e[e.Unknown = 16] = "Unknown", e[e.EOF = 17] = "EOF";
	}(Ts || (Ts = {}));
	const Ms = function(e, t = [], n = As.DEFAULT) {
		let r = null, i = [];
		const s = [];
		function o(e) {
			Array.isArray(i) ? i.push(e) : null !== r && (i[r] = e);
		}
		return function(e, t, n = As.DEFAULT) {
			const r = ps(e, !1), i = [];
			function s(e) {
				return e ? () => e(r.getTokenOffset(), r.getTokenLength(), r.getTokenStartLine(), r.getTokenStartCharacter()) : () => !0;
			}
			function o(e) {
				return e ? () => e(r.getTokenOffset(), r.getTokenLength(), r.getTokenStartLine(), r.getTokenStartCharacter(), () => i.slice()) : () => !0;
			}
			function a(e) {
				return e ? (t) => e(t, r.getTokenOffset(), r.getTokenLength(), r.getTokenStartLine(), r.getTokenStartCharacter()) : () => !0;
			}
			function l(e) {
				return e ? (t) => e(t, r.getTokenOffset(), r.getTokenLength(), r.getTokenStartLine(), r.getTokenStartCharacter(), () => i.slice()) : () => !0;
			}
			const u = o(t.onObjectBegin), c = l(t.onObjectProperty), h = s(t.onObjectEnd), d = o(t.onArrayBegin), f = s(t.onArrayEnd), m = l(t.onLiteralValue), g = a(t.onSeparator), p = s(t.onComment), b = a(t.onError), y = n && n.disallowComments, v = n && n.allowTrailingComma;
			function w() {
				for (;;) {
					const e = r.scan();
					switch (r.getTokenError()) {
						case 4:
							_(14);
							break;
						case 5:
							_(15);
							break;
						case 3:
							_(13);
							break;
						case 1:
							y || _(11);
							break;
						case 2:
							_(12);
							break;
						case 6: _(16);
					}
					switch (e) {
						case 12:
						case 13:
							y ? _(10) : p();
							break;
						case 16:
							_(1);
							break;
						case 15:
						case 14: break;
						default: return e;
					}
				}
			}
			function _(e, t = [], n = []) {
				if (b(e), t.length + n.length > 0) {
					let e = r.getToken();
					for (; 17 !== e;) {
						if (-1 !== t.indexOf(e)) {
							w();
							break;
						}
						if (-1 !== n.indexOf(e)) break;
						e = w();
					}
				}
			}
			function C(e) {
				const t = r.getTokenValue();
				return e ? m(t) : (c(t), i.push(t)), w(), !0;
			}
			function S() {
				switch (r.getToken()) {
					case 11:
						const e = r.getTokenValue();
						let t = Number(e);
						isNaN(t) && (_(2), t = 0), m(t);
						break;
					case 7:
						m(null);
						break;
					case 8:
						m(!0);
						break;
					case 9:
						m(!1);
						break;
					default: return !1;
				}
				return w(), !0;
			}
			function L() {
				return 10 !== r.getToken() ? (_(3, [], [2, 5]), !1) : (C(!1), 6 === r.getToken() ? (g(":"), w(), E() || _(4, [], [2, 5])) : _(5, [], [2, 5]), i.pop(), !0);
			}
			function N() {
				u(), w();
				let e = !1;
				for (; 2 !== r.getToken() && 17 !== r.getToken();) {
					if (5 === r.getToken()) {
						if (e || _(4, [], []), g(","), w(), 2 === r.getToken() && v) break;
					} else e && _(6, [], []);
					L() || _(4, [], [2, 5]), e = !0;
				}
				return h(), 2 !== r.getToken() ? _(7, [2], []) : w(), !0;
			}
			function x() {
				d(), w();
				let e = !0, t = !1;
				for (; 4 !== r.getToken() && 17 !== r.getToken();) {
					if (5 === r.getToken()) {
						if (t || _(4, [], []), g(","), w(), 4 === r.getToken() && v) break;
					} else t && _(6, [], []);
					e ? (i.push(0), e = !1) : i[i.length - 1]++, E() || _(4, [], [4, 5]), t = !0;
				}
				return f(), e || i.pop(), 4 !== r.getToken() ? _(8, [4], []) : w(), !0;
			}
			function E() {
				switch (r.getToken()) {
					case 3: return x();
					case 1: return N();
					case 10: return C(!0);
					default: return S();
				}
			}
			if (w(), 17 === r.getToken()) return !!n.allowEmptyContent || (_(4, [], []), !1);
			if (!E()) return _(4, [], []), !1;
			17 !== r.getToken() && _(9, [], []);
		}(e, {
			onObjectBegin: () => {
				const e = {};
				o(e), s.push(i), i = e, r = null;
			},
			onObjectProperty: (e) => {
				r = e;
			},
			onObjectEnd: () => {
				i = s.pop();
			},
			onArrayBegin: () => {
				const e = [];
				o(e), s.push(i), i = e, r = null;
			},
			onArrayEnd: () => {
				i = s.pop();
			},
			onLiteralValue: o,
			onError: (e, n, r) => {
				t.push({
					error: e,
					offset: n,
					length: r
				});
			}
		}, n), i[0];
	}, Os = function e(t, n, r = !1) {
		if (function(e, t, n = !1) {
			return t >= e.offset && t < e.offset + e.length || n && t === e.offset + e.length;
		}(t, n, r)) {
			const i = t.children;
			if (Array.isArray(i)) for (let t = 0; t < i.length && i[t].offset <= n; t++) {
				const s = e(i[t], n, r);
				if (s) return s;
			}
			return t;
		}
	}, Is = function e(t) {
		if (!t.parent || !t.parent.children) return [];
		const n = e(t.parent);
		if ("property" === t.parent.type) {
			const e = t.parent.children[0].value;
			n.push(e);
		} else if ("array" === t.parent.type) {
			const e = t.parent.children.indexOf(t);
			-1 !== e && n.push(e);
		}
		return n;
	}, Ps = function e(t) {
		switch (t.type) {
			case "array": return t.children.map(e);
			case "object":
				const n = Object.create(null);
				for (let r of t.children) {
					const t = r.children[1];
					t && (n[r.children[0].value] = e(t));
				}
				return n;
			case "null":
			case "string":
			case "number":
			case "boolean": return t.value;
			default: return;
		}
	};
	var Vs, Fs, Ds, qs, Ks, Bs, $s, Us, js, Ws, zs, Hs, Gs, Js, Xs, Qs, Zs, Ys, eo, to, no, ro, io, so, oo, ao, lo, uo, co, ho, fo, mo, go, po, bo, yo, vo, wo, _o, Co, So, Lo, No, xo, Eo, Ao, ko, Ro, To, Mo, Oo, Io, Po, Vo, Fo, Do, qo, Ko, Bo, $o, Uo, jo, Wo, zo, Ho, Go, Jo, Xo, Qo, Zo, Yo, ea, ta, na, ra, ia, sa, oa, aa, la;
	function ua(e, t) {
		if (e === t) return !0;
		if (null == e || null == t) return !1;
		if (typeof e != typeof t) return !1;
		if ("object" != typeof e) return !1;
		if (Array.isArray(e) !== Array.isArray(t)) return !1;
		let n, r;
		if (Array.isArray(e)) {
			if (e.length !== t.length) return !1;
			for (n = 0; n < e.length; n++) if (!ua(e[n], t[n])) return !1;
		} else {
			const i = [];
			for (r in e) i.push(r);
			i.sort();
			const s = [];
			for (r in t) s.push(r);
			if (s.sort(), !ua(i, s)) return !1;
			for (n = 0; n < i.length; n++) if (!ua(e[i[n]], t[i[n]])) return !1;
		}
		return !0;
	}
	function ca(e) {
		return "number" == typeof e;
	}
	function ha(e) {
		return void 0 !== e;
	}
	function da(e) {
		return "boolean" == typeof e;
	}
	function fa(e) {
		return "string" == typeof e;
	}
	function ma(e) {
		return "object" == typeof e && null !== e && !Array.isArray(e);
	}
	function ga(e, t) {
		const n = e.length - t.length;
		return n > 0 ? e.lastIndexOf(t) === n : 0 === n && e === t;
	}
	function pa(e) {
		let t = "";
		(function(e, t) {
			if (e.length < t.length) return !1;
			for (let n = 0; n < t.length; n++) if (e[n] !== t[n]) return !1;
			return !0;
		})(e, "(?i)") && (e = e.substring(4), t = "i");
		try {
			return new RegExp(e, t + "u");
		} catch (Jl) {
			try {
				return new RegExp(e, t);
			} catch (Jl) {
				return;
			}
		}
	}
	function ba(e) {
		let t = 0;
		for (let n = 0; n < e.length; n++) {
			t++;
			const r = e.charCodeAt(n);
			55296 <= r && r <= 56319 && n++;
		}
		return t;
	}
	(function(e) {
		e[e.InvalidSymbol = 1] = "InvalidSymbol", e[e.InvalidNumberFormat = 2] = "InvalidNumberFormat", e[e.PropertyNameExpected = 3] = "PropertyNameExpected", e[e.ValueExpected = 4] = "ValueExpected", e[e.ColonExpected = 5] = "ColonExpected", e[e.CommaExpected = 6] = "CommaExpected", e[e.CloseBraceExpected = 7] = "CloseBraceExpected", e[e.CloseBracketExpected = 8] = "CloseBracketExpected", e[e.EndOfFileExpected = 9] = "EndOfFileExpected", e[e.InvalidCommentToken = 10] = "InvalidCommentToken", e[e.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", e[e.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", e[e.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", e[e.InvalidUnicode = 14] = "InvalidUnicode", e[e.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", e[e.InvalidCharacter = 16] = "InvalidCharacter";
	})(Vs || (Vs = {})), function(e) {
		e.is = function(e) {
			return "string" == typeof e;
		};
	}(Fs || (Fs = {})), function(e) {
		e.is = function(e) {
			return "string" == typeof e;
		};
	}(Ds || (Ds = {})), function(e) {
		e.MIN_VALUE = -2147483648, e.MAX_VALUE = 2147483647, e.is = function(t) {
			return "number" == typeof t && e.MIN_VALUE <= t && t <= e.MAX_VALUE;
		};
	}(qs || (qs = {})), function(e) {
		e.MIN_VALUE = 0, e.MAX_VALUE = 2147483647, e.is = function(t) {
			return "number" == typeof t && e.MIN_VALUE <= t && t <= e.MAX_VALUE;
		};
	}(Ks || (Ks = {})), function(e) {
		e.create = function(e, t) {
			return e === Number.MAX_VALUE && (e = Ks.MAX_VALUE), t === Number.MAX_VALUE && (t = Ks.MAX_VALUE), {
				line: e,
				character: t
			};
		}, e.is = function(e) {
			let t = e;
			return ya.objectLiteral(t) && ya.uinteger(t.line) && ya.uinteger(t.character);
		};
	}(Bs || (Bs = {})), function(e) {
		e.create = function(e, t, n, r) {
			if (ya.uinteger(e) && ya.uinteger(t) && ya.uinteger(n) && ya.uinteger(r)) return {
				start: Bs.create(e, t),
				end: Bs.create(n, r)
			};
			if (Bs.is(e) && Bs.is(t)) return {
				start: e,
				end: t
			};
			throw new Error(`Range#create called with invalid arguments[${e}, ${t}, ${n}, ${r}]`);
		}, e.is = function(e) {
			let t = e;
			return ya.objectLiteral(t) && Bs.is(t.start) && Bs.is(t.end);
		};
	}($s || ($s = {})), function(e) {
		e.create = function(e, t) {
			return {
				uri: e,
				range: t
			};
		}, e.is = function(e) {
			let t = e;
			return ya.objectLiteral(t) && $s.is(t.range) && (ya.string(t.uri) || ya.undefined(t.uri));
		};
	}(Us || (Us = {})), function(e) {
		e.create = function(e, t, n, r) {
			return {
				targetUri: e,
				targetRange: t,
				targetSelectionRange: n,
				originSelectionRange: r
			};
		}, e.is = function(e) {
			let t = e;
			return ya.objectLiteral(t) && $s.is(t.targetRange) && ya.string(t.targetUri) && $s.is(t.targetSelectionRange) && ($s.is(t.originSelectionRange) || ya.undefined(t.originSelectionRange));
		};
	}(js || (js = {})), function(e) {
		e.create = function(e, t, n, r) {
			return {
				red: e,
				green: t,
				blue: n,
				alpha: r
			};
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && ya.numberRange(t.red, 0, 1) && ya.numberRange(t.green, 0, 1) && ya.numberRange(t.blue, 0, 1) && ya.numberRange(t.alpha, 0, 1);
		};
	}(Ws || (Ws = {})), function(e) {
		e.create = function(e, t) {
			return {
				range: e,
				color: t
			};
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && $s.is(t.range) && Ws.is(t.color);
		};
	}(zs || (zs = {})), function(e) {
		e.create = function(e, t, n) {
			return {
				label: e,
				textEdit: t,
				additionalTextEdits: n
			};
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && ya.string(t.label) && (ya.undefined(t.textEdit) || no.is(t)) && (ya.undefined(t.additionalTextEdits) || ya.typedArray(t.additionalTextEdits, no.is));
		};
	}(Hs || (Hs = {})), function(e) {
		e.Comment = "comment", e.Imports = "imports", e.Region = "region";
	}(Gs || (Gs = {})), function(e) {
		e.create = function(e, t, n, r, i, s) {
			const o = {
				startLine: e,
				endLine: t
			};
			return ya.defined(n) && (o.startCharacter = n), ya.defined(r) && (o.endCharacter = r), ya.defined(i) && (o.kind = i), ya.defined(s) && (o.collapsedText = s), o;
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && ya.uinteger(t.startLine) && ya.uinteger(t.startLine) && (ya.undefined(t.startCharacter) || ya.uinteger(t.startCharacter)) && (ya.undefined(t.endCharacter) || ya.uinteger(t.endCharacter)) && (ya.undefined(t.kind) || ya.string(t.kind));
		};
	}(Js || (Js = {})), function(e) {
		e.create = function(e, t) {
			return {
				location: e,
				message: t
			};
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && Us.is(t.location) && ya.string(t.message);
		};
	}(Xs || (Xs = {})), function(e) {
		e.Error = 1, e.Warning = 2, e.Information = 3, e.Hint = 4;
	}(Qs || (Qs = {})), function(e) {
		e.Unnecessary = 1, e.Deprecated = 2;
	}(Zs || (Zs = {})), function(e) {
		e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && ya.string(t.href);
		};
	}(Ys || (Ys = {})), function(e) {
		e.create = function(e, t, n, r, i, s) {
			let o = {
				range: e,
				message: t
			};
			return ya.defined(n) && (o.severity = n), ya.defined(r) && (o.code = r), ya.defined(i) && (o.source = i), ya.defined(s) && (o.relatedInformation = s), o;
		}, e.is = function(e) {
			var t;
			let n = e;
			return ya.defined(n) && $s.is(n.range) && ya.string(n.message) && (ya.number(n.severity) || ya.undefined(n.severity)) && (ya.integer(n.code) || ya.string(n.code) || ya.undefined(n.code)) && (ya.undefined(n.codeDescription) || ya.string(null === (t = n.codeDescription) || void 0 === t ? void 0 : t.href)) && (ya.string(n.source) || ya.undefined(n.source)) && (ya.undefined(n.relatedInformation) || ya.typedArray(n.relatedInformation, Xs.is));
		};
	}(eo || (eo = {})), function(e) {
		e.create = function(e, t, ...n) {
			let r = {
				title: e,
				command: t
			};
			return ya.defined(n) && n.length > 0 && (r.arguments = n), r;
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && ya.string(t.title) && ya.string(t.command);
		};
	}(to || (to = {})), function(e) {
		e.replace = function(e, t) {
			return {
				range: e,
				newText: t
			};
		}, e.insert = function(e, t) {
			return {
				range: {
					start: e,
					end: e
				},
				newText: t
			};
		}, e.del = function(e) {
			return {
				range: e,
				newText: ""
			};
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && ya.string(t.newText) && $s.is(t.range);
		};
	}(no || (no = {})), function(e) {
		e.create = function(e, t, n) {
			const r = { label: e };
			return void 0 !== t && (r.needsConfirmation = t), void 0 !== n && (r.description = n), r;
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && ya.string(t.label) && (ya.boolean(t.needsConfirmation) || void 0 === t.needsConfirmation) && (ya.string(t.description) || void 0 === t.description);
		};
	}(ro || (ro = {})), function(e) {
		e.is = function(e) {
			const t = e;
			return ya.string(t);
		};
	}(io || (io = {})), function(e) {
		e.replace = function(e, t, n) {
			return {
				range: e,
				newText: t,
				annotationId: n
			};
		}, e.insert = function(e, t, n) {
			return {
				range: {
					start: e,
					end: e
				},
				newText: t,
				annotationId: n
			};
		}, e.del = function(e, t) {
			return {
				range: e,
				newText: "",
				annotationId: t
			};
		}, e.is = function(e) {
			const t = e;
			return no.is(t) && (ro.is(t.annotationId) || io.is(t.annotationId));
		};
	}(so || (so = {})), function(e) {
		e.create = function(e, t) {
			return {
				textDocument: e,
				edits: t
			};
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && mo.is(t.textDocument) && Array.isArray(t.edits);
		};
	}(oo || (oo = {})), function(e) {
		e.create = function(e, t, n) {
			let r = {
				kind: "create",
				uri: e
			};
			return void 0 === t || void 0 === t.overwrite && void 0 === t.ignoreIfExists || (r.options = t), void 0 !== n && (r.annotationId = n), r;
		}, e.is = function(e) {
			let t = e;
			return t && "create" === t.kind && ya.string(t.uri) && (void 0 === t.options || (void 0 === t.options.overwrite || ya.boolean(t.options.overwrite)) && (void 0 === t.options.ignoreIfExists || ya.boolean(t.options.ignoreIfExists))) && (void 0 === t.annotationId || io.is(t.annotationId));
		};
	}(ao || (ao = {})), function(e) {
		e.create = function(e, t, n, r) {
			let i = {
				kind: "rename",
				oldUri: e,
				newUri: t
			};
			return void 0 === n || void 0 === n.overwrite && void 0 === n.ignoreIfExists || (i.options = n), void 0 !== r && (i.annotationId = r), i;
		}, e.is = function(e) {
			let t = e;
			return t && "rename" === t.kind && ya.string(t.oldUri) && ya.string(t.newUri) && (void 0 === t.options || (void 0 === t.options.overwrite || ya.boolean(t.options.overwrite)) && (void 0 === t.options.ignoreIfExists || ya.boolean(t.options.ignoreIfExists))) && (void 0 === t.annotationId || io.is(t.annotationId));
		};
	}(lo || (lo = {})), function(e) {
		e.create = function(e, t, n) {
			let r = {
				kind: "delete",
				uri: e
			};
			return void 0 === t || void 0 === t.recursive && void 0 === t.ignoreIfNotExists || (r.options = t), void 0 !== n && (r.annotationId = n), r;
		}, e.is = function(e) {
			let t = e;
			return t && "delete" === t.kind && ya.string(t.uri) && (void 0 === t.options || (void 0 === t.options.recursive || ya.boolean(t.options.recursive)) && (void 0 === t.options.ignoreIfNotExists || ya.boolean(t.options.ignoreIfNotExists))) && (void 0 === t.annotationId || io.is(t.annotationId));
		};
	}(uo || (uo = {})), function(e) {
		e.is = function(e) {
			let t = e;
			return t && (void 0 !== t.changes || void 0 !== t.documentChanges) && (void 0 === t.documentChanges || t.documentChanges.every((e) => ya.string(e.kind) ? ao.is(e) || lo.is(e) || uo.is(e) : oo.is(e)));
		};
	}(co || (co = {})), function(e) {
		e.create = function(e) {
			return { uri: e };
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && ya.string(t.uri);
		};
	}(ho || (ho = {})), function(e) {
		e.create = function(e, t) {
			return {
				uri: e,
				version: t
			};
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && ya.string(t.uri) && ya.integer(t.version);
		};
	}(fo || (fo = {})), function(e) {
		e.create = function(e, t) {
			return {
				uri: e,
				version: t
			};
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && ya.string(t.uri) && (null === t.version || ya.integer(t.version));
		};
	}(mo || (mo = {})), function(e) {
		e.create = function(e, t, n, r) {
			return {
				uri: e,
				languageId: t,
				version: n,
				text: r
			};
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && ya.string(t.uri) && ya.string(t.languageId) && ya.integer(t.version) && ya.string(t.text);
		};
	}(go || (go = {})), function(e) {
		e.PlainText = "plaintext", e.Markdown = "markdown", e.is = function(t) {
			const n = t;
			return n === e.PlainText || n === e.Markdown;
		};
	}(po || (po = {})), function(e) {
		e.is = function(e) {
			const t = e;
			return ya.objectLiteral(e) && po.is(t.kind) && ya.string(t.value);
		};
	}(bo || (bo = {})), function(e) {
		e.Text = 1, e.Method = 2, e.Function = 3, e.Constructor = 4, e.Field = 5, e.Variable = 6, e.Class = 7, e.Interface = 8, e.Module = 9, e.Property = 10, e.Unit = 11, e.Value = 12, e.Enum = 13, e.Keyword = 14, e.Snippet = 15, e.Color = 16, e.File = 17, e.Reference = 18, e.Folder = 19, e.EnumMember = 20, e.Constant = 21, e.Struct = 22, e.Event = 23, e.Operator = 24, e.TypeParameter = 25;
	}(yo || (yo = {})), function(e) {
		e.PlainText = 1, e.Snippet = 2;
	}(vo || (vo = {})), function(e) {
		e.Deprecated = 1;
	}(wo || (wo = {})), function(e) {
		e.create = function(e, t, n) {
			return {
				newText: e,
				insert: t,
				replace: n
			};
		}, e.is = function(e) {
			const t = e;
			return t && ya.string(t.newText) && $s.is(t.insert) && $s.is(t.replace);
		};
	}(_o || (_o = {})), function(e) {
		e.asIs = 1, e.adjustIndentation = 2;
	}(Co || (Co = {})), function(e) {
		e.is = function(e) {
			const t = e;
			return t && (ya.string(t.detail) || void 0 === t.detail) && (ya.string(t.description) || void 0 === t.description);
		};
	}(So || (So = {})), function(e) {
		e.create = function(e) {
			return { label: e };
		};
	}(Lo || (Lo = {})), function(e) {
		e.create = function(e, t) {
			return {
				items: e || [],
				isIncomplete: !!t
			};
		};
	}(No || (No = {})), function(e) {
		e.fromPlainText = function(e) {
			return e.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
		}, e.is = function(e) {
			const t = e;
			return ya.string(t) || ya.objectLiteral(t) && ya.string(t.language) && ya.string(t.value);
		};
	}(xo || (xo = {})), function(e) {
		e.is = function(e) {
			let t = e;
			return !!t && ya.objectLiteral(t) && (bo.is(t.contents) || xo.is(t.contents) || ya.typedArray(t.contents, xo.is)) && (void 0 === e.range || $s.is(e.range));
		};
	}(Eo || (Eo = {})), function(e) {
		e.create = function(e, t) {
			return t ? {
				label: e,
				documentation: t
			} : { label: e };
		};
	}(Ao || (Ao = {})), function(e) {
		e.create = function(e, t, ...n) {
			let r = { label: e };
			return ya.defined(t) && (r.documentation = t), ya.defined(n) ? r.parameters = n : r.parameters = [], r;
		};
	}(ko || (ko = {})), function(e) {
		e.Text = 1, e.Read = 2, e.Write = 3;
	}(Ro || (Ro = {})), function(e) {
		e.create = function(e, t) {
			let n = { range: e };
			return ya.number(t) && (n.kind = t), n;
		};
	}(To || (To = {})), function(e) {
		e.File = 1, e.Module = 2, e.Namespace = 3, e.Package = 4, e.Class = 5, e.Method = 6, e.Property = 7, e.Field = 8, e.Constructor = 9, e.Enum = 10, e.Interface = 11, e.Function = 12, e.Variable = 13, e.Constant = 14, e.String = 15, e.Number = 16, e.Boolean = 17, e.Array = 18, e.Object = 19, e.Key = 20, e.Null = 21, e.EnumMember = 22, e.Struct = 23, e.Event = 24, e.Operator = 25, e.TypeParameter = 26;
	}(Mo || (Mo = {})), function(e) {
		e.Deprecated = 1;
	}(Oo || (Oo = {})), function(e) {
		e.create = function(e, t, n, r, i) {
			let s = {
				name: e,
				kind: t,
				location: {
					uri: r,
					range: n
				}
			};
			return i && (s.containerName = i), s;
		};
	}(Io || (Io = {})), function(e) {
		e.create = function(e, t, n, r) {
			return void 0 !== r ? {
				name: e,
				kind: t,
				location: {
					uri: n,
					range: r
				}
			} : {
				name: e,
				kind: t,
				location: { uri: n }
			};
		};
	}(Po || (Po = {})), function(e) {
		e.create = function(e, t, n, r, i, s) {
			let o = {
				name: e,
				detail: t,
				kind: n,
				range: r,
				selectionRange: i
			};
			return void 0 !== s && (o.children = s), o;
		}, e.is = function(e) {
			let t = e;
			return t && ya.string(t.name) && ya.number(t.kind) && $s.is(t.range) && $s.is(t.selectionRange) && (void 0 === t.detail || ya.string(t.detail)) && (void 0 === t.deprecated || ya.boolean(t.deprecated)) && (void 0 === t.children || Array.isArray(t.children)) && (void 0 === t.tags || Array.isArray(t.tags));
		};
	}(Vo || (Vo = {})), function(e) {
		e.Empty = "", e.QuickFix = "quickfix", e.Refactor = "refactor", e.RefactorExtract = "refactor.extract", e.RefactorInline = "refactor.inline", e.RefactorRewrite = "refactor.rewrite", e.Source = "source", e.SourceOrganizeImports = "source.organizeImports", e.SourceFixAll = "source.fixAll";
	}(Fo || (Fo = {})), function(e) {
		e.Invoked = 1, e.Automatic = 2;
	}(Do || (Do = {})), function(e) {
		e.create = function(e, t, n) {
			let r = { diagnostics: e };
			return null != t && (r.only = t), null != n && (r.triggerKind = n), r;
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && ya.typedArray(t.diagnostics, eo.is) && (void 0 === t.only || ya.typedArray(t.only, ya.string)) && (void 0 === t.triggerKind || t.triggerKind === Do.Invoked || t.triggerKind === Do.Automatic);
		};
	}(qo || (qo = {})), function(e) {
		e.create = function(e, t, n) {
			let r = { title: e }, i = !0;
			return "string" == typeof t ? (i = !1, r.kind = t) : to.is(t) ? r.command = t : r.edit = t, i && void 0 !== n && (r.kind = n), r;
		}, e.is = function(e) {
			let t = e;
			return t && ya.string(t.title) && (void 0 === t.diagnostics || ya.typedArray(t.diagnostics, eo.is)) && (void 0 === t.kind || ya.string(t.kind)) && (void 0 !== t.edit || void 0 !== t.command) && (void 0 === t.command || to.is(t.command)) && (void 0 === t.isPreferred || ya.boolean(t.isPreferred)) && (void 0 === t.edit || co.is(t.edit));
		};
	}(Ko || (Ko = {})), function(e) {
		e.create = function(e, t) {
			let n = { range: e };
			return ya.defined(t) && (n.data = t), n;
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && $s.is(t.range) && (ya.undefined(t.command) || to.is(t.command));
		};
	}(Bo || (Bo = {})), function(e) {
		e.create = function(e, t) {
			return {
				tabSize: e,
				insertSpaces: t
			};
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && ya.uinteger(t.tabSize) && ya.boolean(t.insertSpaces);
		};
	}($o || ($o = {})), function(e) {
		e.create = function(e, t, n) {
			return {
				range: e,
				target: t,
				data: n
			};
		}, e.is = function(e) {
			let t = e;
			return ya.defined(t) && $s.is(t.range) && (ya.undefined(t.target) || ya.string(t.target));
		};
	}(Uo || (Uo = {})), function(e) {
		e.create = function(e, t) {
			return {
				range: e,
				parent: t
			};
		}, e.is = function(t) {
			let n = t;
			return ya.objectLiteral(n) && $s.is(n.range) && (void 0 === n.parent || e.is(n.parent));
		};
	}(jo || (jo = {})), function(e) {
		e.namespace = "namespace", e.type = "type", e.class = "class", e.enum = "enum", e.interface = "interface", e.struct = "struct", e.typeParameter = "typeParameter", e.parameter = "parameter", e.variable = "variable", e.property = "property", e.enumMember = "enumMember", e.event = "event", e.function = "function", e.method = "method", e.macro = "macro", e.keyword = "keyword", e.modifier = "modifier", e.comment = "comment", e.string = "string", e.number = "number", e.regexp = "regexp", e.operator = "operator", e.decorator = "decorator";
	}(Wo || (Wo = {})), function(e) {
		e.declaration = "declaration", e.definition = "definition", e.readonly = "readonly", e.static = "static", e.deprecated = "deprecated", e.abstract = "abstract", e.async = "async", e.modification = "modification", e.documentation = "documentation", e.defaultLibrary = "defaultLibrary";
	}(zo || (zo = {})), function(e) {
		e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && (void 0 === t.resultId || "string" == typeof t.resultId) && Array.isArray(t.data) && (0 === t.data.length || "number" == typeof t.data[0]);
		};
	}(Ho || (Ho = {})), function(e) {
		e.create = function(e, t) {
			return {
				range: e,
				text: t
			};
		}, e.is = function(e) {
			const t = e;
			return null != t && $s.is(t.range) && ya.string(t.text);
		};
	}(Go || (Go = {})), function(e) {
		e.create = function(e, t, n) {
			return {
				range: e,
				variableName: t,
				caseSensitiveLookup: n
			};
		}, e.is = function(e) {
			const t = e;
			return null != t && $s.is(t.range) && ya.boolean(t.caseSensitiveLookup) && (ya.string(t.variableName) || void 0 === t.variableName);
		};
	}(Jo || (Jo = {})), function(e) {
		e.create = function(e, t) {
			return {
				range: e,
				expression: t
			};
		}, e.is = function(e) {
			const t = e;
			return null != t && $s.is(t.range) && (ya.string(t.expression) || void 0 === t.expression);
		};
	}(Xo || (Xo = {})), function(e) {
		e.create = function(e, t) {
			return {
				frameId: e,
				stoppedLocation: t
			};
		}, e.is = function(e) {
			const t = e;
			return ya.defined(t) && $s.is(e.stoppedLocation);
		};
	}(Qo || (Qo = {})), function(e) {
		e.Type = 1, e.Parameter = 2, e.is = function(e) {
			return 1 === e || 2 === e;
		};
	}(Zo || (Zo = {})), function(e) {
		e.create = function(e) {
			return { value: e };
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && (void 0 === t.tooltip || ya.string(t.tooltip) || bo.is(t.tooltip)) && (void 0 === t.location || Us.is(t.location)) && (void 0 === t.command || to.is(t.command));
		};
	}(Yo || (Yo = {})), function(e) {
		e.create = function(e, t, n) {
			const r = {
				position: e,
				label: t
			};
			return void 0 !== n && (r.kind = n), r;
		}, e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && Bs.is(t.position) && (ya.string(t.label) || ya.typedArray(t.label, Yo.is)) && (void 0 === t.kind || Zo.is(t.kind)) && void 0 === t.textEdits || ya.typedArray(t.textEdits, no.is) && (void 0 === t.tooltip || ya.string(t.tooltip) || bo.is(t.tooltip)) && (void 0 === t.paddingLeft || ya.boolean(t.paddingLeft)) && (void 0 === t.paddingRight || ya.boolean(t.paddingRight));
		};
	}(ea || (ea = {})), function(e) {
		e.createSnippet = function(e) {
			return {
				kind: "snippet",
				value: e
			};
		};
	}(ta || (ta = {})), function(e) {
		e.create = function(e, t, n, r) {
			return {
				insertText: e,
				filterText: t,
				range: n,
				command: r
			};
		};
	}(na || (na = {})), function(e) {
		e.create = function(e) {
			return { items: e };
		};
	}(ra || (ra = {})), function(e) {
		e.Invoked = 0, e.Automatic = 1;
	}(ia || (ia = {})), function(e) {
		e.create = function(e, t) {
			return {
				range: e,
				text: t
			};
		};
	}(sa || (sa = {})), function(e) {
		e.create = function(e, t) {
			return {
				triggerKind: e,
				selectedCompletionInfo: t
			};
		};
	}(oa || (oa = {})), function(e) {
		e.is = function(e) {
			const t = e;
			return ya.objectLiteral(t) && Ds.is(t.uri) && ya.string(t.name);
		};
	}(aa || (aa = {})), function(e) {
		function t(e, n) {
			if (e.length <= 1) return e;
			const r = e.length / 2 | 0, i = e.slice(0, r), s = e.slice(r);
			t(i, n), t(s, n);
			let o = 0, a = 0, l = 0;
			for (; o < i.length && a < s.length;) n(i[o], s[a]) <= 0 ? e[l++] = i[o++] : e[l++] = s[a++];
			for (; o < i.length;) e[l++] = i[o++];
			for (; a < s.length;) e[l++] = s[a++];
			return e;
		}
		e.create = function(e, t, n, r) {
			return new va(e, t, n, r);
		}, e.is = function(e) {
			let t = e;
			return !!(ya.defined(t) && ya.string(t.uri) && (ya.undefined(t.languageId) || ya.string(t.languageId)) && ya.uinteger(t.lineCount) && ya.func(t.getText) && ya.func(t.positionAt) && ya.func(t.offsetAt));
		}, e.applyEdits = function(e, n) {
			let r = e.getText(), i = t(n, (e, t) => {
				let n = e.range.start.line - t.range.start.line;
				return 0 === n ? e.range.start.character - t.range.start.character : n;
			}), s = r.length;
			for (let t = i.length - 1; t >= 0; t--) {
				let n = i[t], o = e.offsetAt(n.range.start), a = e.offsetAt(n.range.end);
				if (!(a <= s)) throw new Error("Overlapping edit");
				r = r.substring(0, o) + n.newText + r.substring(a, r.length), s = o;
			}
			return r;
		};
	}(la || (la = {}));
	var ya, va = class {
		constructor(e, t, n, r) {
			this._uri = e, this._languageId = t, this._version = n, this._content = r, this._lineOffsets = void 0;
		}
		get uri() {
			return this._uri;
		}
		get languageId() {
			return this._languageId;
		}
		get version() {
			return this._version;
		}
		getText(e) {
			if (e) {
				let t = this.offsetAt(e.start), n = this.offsetAt(e.end);
				return this._content.substring(t, n);
			}
			return this._content;
		}
		update(e, t) {
			this._content = e.text, this._version = t, this._lineOffsets = void 0;
		}
		getLineOffsets() {
			if (void 0 === this._lineOffsets) {
				let e = [], t = this._content, n = !0;
				for (let r = 0; r < t.length; r++) {
					n && (e.push(r), n = !1);
					let i = t.charAt(r);
					n = "\r" === i || "\n" === i, "\r" === i && r + 1 < t.length && "\n" === t.charAt(r + 1) && r++;
				}
				n && t.length > 0 && e.push(t.length), this._lineOffsets = e;
			}
			return this._lineOffsets;
		}
		positionAt(e) {
			e = Math.max(Math.min(e, this._content.length), 0);
			let t = this.getLineOffsets(), n = 0, r = t.length;
			if (0 === r) return Bs.create(0, e);
			for (; n < r;) {
				let i = Math.floor((n + r) / 2);
				t[i] > e ? r = i : n = i + 1;
			}
			let i = n - 1;
			return Bs.create(i, e - t[i]);
		}
		offsetAt(e) {
			let t = this.getLineOffsets();
			if (e.line >= t.length) return this._content.length;
			if (e.line < 0) return 0;
			let n = t[e.line], r = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
			return Math.max(Math.min(n + e.character, r), n);
		}
		get lineCount() {
			return this.getLineOffsets().length;
		}
	};
	(function(e) {
		const t = Object.prototype.toString;
		e.defined = function(e) {
			return void 0 !== e;
		}, e.undefined = function(e) {
			return void 0 === e;
		}, e.boolean = function(e) {
			return !0 === e || !1 === e;
		}, e.string = function(e) {
			return "[object String]" === t.call(e);
		}, e.number = function(e) {
			return "[object Number]" === t.call(e);
		}, e.numberRange = function(e, n, r) {
			return "[object Number]" === t.call(e) && n <= e && e <= r;
		}, e.integer = function(e) {
			return "[object Number]" === t.call(e) && -2147483648 <= e && e <= 2147483647;
		}, e.uinteger = function(e) {
			return "[object Number]" === t.call(e) && 0 <= e && e <= 2147483647;
		}, e.func = function(e) {
			return "[object Function]" === t.call(e);
		}, e.objectLiteral = function(e) {
			return null !== e && "object" == typeof e;
		}, e.typedArray = function(e, t) {
			return Array.isArray(e) && e.every(t);
		};
	})(ya || (ya = {}));
	var wa, _a, Ca, Sa, La = class e {
		constructor(e, t, n, r) {
			this._uri = e, this._languageId = t, this._version = n, this._content = r, this._lineOffsets = void 0;
		}
		get uri() {
			return this._uri;
		}
		get languageId() {
			return this._languageId;
		}
		get version() {
			return this._version;
		}
		getText(e) {
			if (e) {
				const t = this.offsetAt(e.start), n = this.offsetAt(e.end);
				return this._content.substring(t, n);
			}
			return this._content;
		}
		update(t, n) {
			for (let r of t) if (e.isIncremental(r)) {
				const e = Ea(r.range), t = this.offsetAt(e.start), n = this.offsetAt(e.end);
				this._content = this._content.substring(0, t) + r.text + this._content.substring(n, this._content.length);
				const i = Math.max(e.start.line, 0), s = Math.max(e.end.line, 0);
				let o = this._lineOffsets;
				const a = xa(r.text, !1, t);
				if (s - i === a.length) for (let r = 0, u = a.length; r < u; r++) o[r + i + 1] = a[r];
				else a.length < 1e4 ? o.splice(i + 1, s - i, ...a) : this._lineOffsets = o = o.slice(0, i + 1).concat(a, o.slice(s + 1));
				const l = r.text.length - (n - t);
				if (0 !== l) for (let r = i + 1 + a.length, u = o.length; r < u; r++) o[r] = o[r] + l;
			} else {
				if (!e.isFull(r)) throw new Error("Unknown change event received");
				this._content = r.text, this._lineOffsets = void 0;
			}
			this._version = n;
		}
		getLineOffsets() {
			return void 0 === this._lineOffsets && (this._lineOffsets = xa(this._content, !0)), this._lineOffsets;
		}
		positionAt(e) {
			e = Math.max(Math.min(e, this._content.length), 0);
			let t = this.getLineOffsets(), n = 0, r = t.length;
			if (0 === r) return {
				line: 0,
				character: e
			};
			for (; n < r;) {
				let i = Math.floor((n + r) / 2);
				t[i] > e ? r = i : n = i + 1;
			}
			let i = n - 1;
			return {
				line: i,
				character: e - t[i]
			};
		}
		offsetAt(e) {
			let t = this.getLineOffsets();
			if (e.line >= t.length) return this._content.length;
			if (e.line < 0) return 0;
			let n = t[e.line], r = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
			return Math.max(Math.min(n + e.character, r), n);
		}
		get lineCount() {
			return this.getLineOffsets().length;
		}
		static isIncremental(e) {
			let t = e;
			return null != t && "string" == typeof t.text && void 0 !== t.range && (void 0 === t.rangeLength || "number" == typeof t.rangeLength);
		}
		static isFull(e) {
			let t = e;
			return null != t && "string" == typeof t.text && void 0 === t.range && void 0 === t.rangeLength;
		}
	};
	function Na(e, t) {
		if (e.length <= 1) return e;
		const n = e.length / 2 | 0, r = e.slice(0, n), i = e.slice(n);
		Na(r, t), Na(i, t);
		let s = 0, o = 0, a = 0;
		for (; s < r.length && o < i.length;) t(r[s], i[o]) <= 0 ? e[a++] = r[s++] : e[a++] = i[o++];
		for (; s < r.length;) e[a++] = r[s++];
		for (; o < i.length;) e[a++] = i[o++];
		return e;
	}
	function xa(e, t, n = 0) {
		const r = t ? [n] : [];
		for (let i = 0; i < e.length; i++) {
			let t = e.charCodeAt(i);
			13 !== t && 10 !== t || (13 === t && i + 1 < e.length && 10 === e.charCodeAt(i + 1) && i++, r.push(n + i + 1));
		}
		return r;
	}
	function Ea(e) {
		const t = e.start, n = e.end;
		return t.line > n.line || t.line === n.line && t.character > n.character ? {
			start: n,
			end: t
		} : e;
	}
	function Aa(e) {
		const t = Ea(e.range);
		return t !== e.range ? {
			newText: e.newText,
			range: t
		} : e;
	}
	function ka(...e) {
		const t = e[0];
		let n, r, i;
		if ("string" == typeof t) n = t, r = t, e.splice(0, 1), i = e && "object" == typeof e[0] ? e[0] : e;
		else {
			if (t instanceof Array) {
				const n = e.slice(1);
				if (t.length !== n.length + 1) throw new Error("expected a string as the first argument to l10n.t");
				let r = t[0];
				for (let e = 1; e < t.length; e++) r += `{${e - 1}}` + t[e];
				return ka(r, ...n);
			}
			r = t.message, n = r, t.comment && t.comment.length > 0 && (n += `/${Array.isArray(t.comment) ? t.comment.join("") : t.comment}`), i = t.args ?? {};
		}
		return s = r, o = i, 0 === Object.keys(o).length ? s : s.replace(Ra, (e, t) => o[t] ?? e);
		var s, o;
	}
	(function(e) {
		e.create = function(e, t, n, r) {
			return new La(e, t, n, r);
		}, e.update = function(e, t, n) {
			if (e instanceof La) return e.update(t, n), e;
			throw new Error("TextDocument.update: document must be created by TextDocument.create");
		}, e.applyEdits = function(e, t) {
			let n = e.getText(), r = Na(t.map(Aa), (e, t) => {
				let n = e.range.start.line - t.range.start.line;
				return 0 === n ? e.range.start.character - t.range.start.character : n;
			}), i = 0;
			const s = [];
			for (const o of r) {
				let t = e.offsetAt(o.range.start);
				if (t < i) throw new Error("Overlapping edit");
				t > i && s.push(n.substring(i, t)), o.newText.length && s.push(o.newText), i = e.offsetAt(o.range.end);
			}
			return s.push(n.substr(i)), s.join("");
		};
	})(wa || (wa = {})), function(e) {
		e[e.Undefined = 0] = "Undefined", e[e.EnumValueMismatch = 1] = "EnumValueMismatch", e[e.Deprecated = 2] = "Deprecated", e[e.UnexpectedEndOfComment = 257] = "UnexpectedEndOfComment", e[e.UnexpectedEndOfString = 258] = "UnexpectedEndOfString", e[e.UnexpectedEndOfNumber = 259] = "UnexpectedEndOfNumber", e[e.InvalidUnicode = 260] = "InvalidUnicode", e[e.InvalidEscapeCharacter = 261] = "InvalidEscapeCharacter", e[e.InvalidCharacter = 262] = "InvalidCharacter", e[e.PropertyExpected = 513] = "PropertyExpected", e[e.CommaExpected = 514] = "CommaExpected", e[e.ColonExpected = 515] = "ColonExpected", e[e.ValueExpected = 516] = "ValueExpected", e[e.CommaOrCloseBacketExpected = 517] = "CommaOrCloseBacketExpected", e[e.CommaOrCloseBraceExpected = 518] = "CommaOrCloseBraceExpected", e[e.TrailingComma = 519] = "TrailingComma", e[e.DuplicateKey = 520] = "DuplicateKey", e[e.CommentNotPermitted = 521] = "CommentNotPermitted", e[e.PropertyKeysMustBeDoublequoted = 528] = "PropertyKeysMustBeDoublequoted", e[e.SchemaResolveError = 768] = "SchemaResolveError", e[e.SchemaUnsupportedFeature = 769] = "SchemaUnsupportedFeature";
	}(_a || (_a = {})), function(e) {
		e[e.v3 = 3] = "v3", e[e.v4 = 4] = "v4", e[e.v6 = 6] = "v6", e[e.v7 = 7] = "v7", e[e.v2019_09 = 19] = "v2019_09", e[e.v2020_12 = 20] = "v2020_12";
	}(Ca || (Ca = {})), function(e) {
		e.LATEST = { textDocument: { completion: { completionItem: {
			documentationFormat: [po.Markdown, po.PlainText],
			commitCharactersSupport: !0,
			labelDetailsSupport: !0
		} } } };
	}(Sa || (Sa = {}));
	var Ra = /{([^}]+)}/g;
	const Ta = {
		"color-hex": {
			errorMessage: ka("Invalid color format. Use #RGB, #RGBA, #RRGGBB or #RRGGBBAA."),
			pattern: /^#([0-9A-Fa-f]{3,4}|([0-9A-Fa-f]{2}){3,4})$/
		},
		"date-time": {
			errorMessage: ka("String is not a RFC3339 date-time."),
			pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9]))$/i
		},
		date: {
			errorMessage: ka("String is not a RFC3339 date."),
			pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/i
		},
		time: {
			errorMessage: ka("String is not a RFC3339 time."),
			pattern: /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9]))$/i
		},
		email: {
			errorMessage: ka("String is not an e-mail address."),
			pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/
		},
		hostname: {
			errorMessage: ka("String is not a hostname."),
			pattern: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i
		},
		ipv4: {
			errorMessage: ka("String is not an IPv4 address."),
			pattern: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/
		},
		ipv6: {
			errorMessage: ka("String is not an IPv6 address."),
			pattern: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i
		}
	};
	var Ma, Oa = class {
		constructor(e, t, n = 0) {
			this.offset = t, this.length = n, this.parent = e;
		}
		get children() {
			return [];
		}
		toString() {
			return "type: " + this.type + " (" + this.offset + "/" + this.length + ")" + (this.parent ? " parent: {" + this.parent.toString() + "}" : "");
		}
	}, Ia = class extends Oa {
		constructor(e, t) {
			super(e, t), this.type = "null", this.value = null;
		}
	}, Pa = class extends Oa {
		constructor(e, t, n) {
			super(e, n), this.type = "boolean", this.value = t;
		}
	}, Va = class extends Oa {
		constructor(e, t) {
			super(e, t), this.type = "array", this.items = [];
		}
		get children() {
			return this.items;
		}
	}, Fa = class extends Oa {
		constructor(e, t) {
			super(e, t), this.type = "number", this.isInteger = !0, this.value = NaN;
		}
	}, Da = class extends Oa {
		constructor(e, t, n) {
			super(e, t, n), this.type = "string", this.value = "";
		}
	}, qa = class extends Oa {
		constructor(e, t, n) {
			super(e, t), this.type = "property", this.colonOffset = -1, this.keyNode = n;
		}
		get children() {
			return this.valueNode ? [this.keyNode, this.valueNode] : [this.keyNode];
		}
	}, Ka = class extends Oa {
		constructor(e, t) {
			super(e, t), this.type = "object", this.properties = [];
		}
		get children() {
			return this.properties;
		}
	};
	function Ba(e) {
		return da(e) ? e ? {} : { not: {} } : e;
	}
	(function(e) {
		e[e.Key = 0] = "Key", e[e.Enum = 1] = "Enum";
	})(Ma || (Ma = {}));
	const $a = {
		"http://json-schema.org/draft-03/schema#": Ca.v3,
		"http://json-schema.org/draft-04/schema#": Ca.v4,
		"http://json-schema.org/draft-06/schema#": Ca.v6,
		"http://json-schema.org/draft-07/schema#": Ca.v7,
		"https://json-schema.org/draft/2019-09/schema": Ca.v2019_09,
		"https://json-schema.org/draft/2020-12/schema": Ca.v2020_12
	};
	var Ua = class {
		constructor(e) {
			this.schemaDraft = e;
		}
	}, ja = class e {
		constructor(e = -1, t) {
			this.focusOffset = e, this.exclude = t, this.schemas = [];
		}
		add(e) {
			this.schemas.push(e);
		}
		merge(e) {
			Array.prototype.push.apply(this.schemas, e.schemas);
		}
		include(e) {
			return (-1 === this.focusOffset || Ja(e, this.focusOffset)) && e !== this.exclude;
		}
		newSub() {
			return new e(-1, this.exclude);
		}
	}, Wa = class {
		constructor() {}
		get schemas() {
			return [];
		}
		add(e) {}
		merge(e) {}
		include(e) {
			return !0;
		}
		newSub() {
			return this;
		}
	};
	Wa.instance = new Wa();
	var za = class {
		constructor() {
			this.problems = [], this.propertiesMatches = 0, this.processedProperties = /* @__PURE__ */ new Set(), this.propertiesValueMatches = 0, this.primaryValueMatches = 0, this.enumValueMatch = !1, this.enumValues = void 0;
		}
		hasProblems() {
			return !!this.problems.length;
		}
		merge(e) {
			this.problems = this.problems.concat(e.problems), this.propertiesMatches += e.propertiesMatches, this.propertiesValueMatches += e.propertiesValueMatches, this.mergeProcessedProperties(e);
		}
		mergeEnumValues(e) {
			if (!this.enumValueMatch && !e.enumValueMatch && this.enumValues && e.enumValues) {
				this.enumValues = this.enumValues.concat(e.enumValues);
				for (const e of this.problems) e.code === _a.EnumValueMismatch && (e.message = ka("Value is not accepted. Valid values: {0}.", this.enumValues.map((e) => JSON.stringify(e)).join(", ")));
			}
		}
		mergePropertyMatch(e) {
			this.problems = this.problems.concat(e.problems), this.propertiesMatches++, (e.enumValueMatch || !e.hasProblems() && e.propertiesMatches) && this.propertiesValueMatches++, e.enumValueMatch && e.enumValues && 1 === e.enumValues.length && this.primaryValueMatches++;
		}
		mergeProcessedProperties(e) {
			e.processedProperties.forEach((e) => this.processedProperties.add(e));
		}
		compare(e) {
			const t = this.hasProblems();
			return t !== e.hasProblems() ? t ? -1 : 1 : this.enumValueMatch !== e.enumValueMatch ? e.enumValueMatch ? -1 : 1 : this.primaryValueMatches !== e.primaryValueMatches ? this.primaryValueMatches - e.primaryValueMatches : this.propertiesValueMatches !== e.propertiesValueMatches ? this.propertiesValueMatches - e.propertiesValueMatches : this.propertiesMatches - e.propertiesMatches;
		}
	};
	function Ha(e) {
		return Ps(e);
	}
	function Ga(e) {
		return Is(e);
	}
	function Ja(e, t, n = !1) {
		return t >= e.offset && t < e.offset + e.length || n && t === e.offset + e.length;
	}
	var Xa = class {
		constructor(e, t = [], n = []) {
			this.root = e, this.syntaxErrors = t, this.comments = n;
		}
		getNodeFromOffset(e, t = !1) {
			if (this.root) return Os(this.root, e, t);
		}
		visit(e) {
			if (this.root) {
				const t = (n) => {
					let r = e(n);
					const i = n.children;
					if (Array.isArray(i)) for (let e = 0; e < i.length && r; e++) r = t(i[e]);
					return r;
				};
				t(this.root);
			}
		}
		validate(e, t, n = Qs.Warning, r) {
			if (this.root && t) {
				const i = new za();
				return Za(this.root, t, i, Wa.instance, new Ua(r ?? Qa(t))), i.problems.map((t) => {
					const r = $s.create(e.positionAt(t.location.offset), e.positionAt(t.location.offset + t.location.length));
					return eo.create(r, t.message, t.severity ?? n, t.code);
				});
			}
		}
		getMatchingSchemas(e, t = -1, n) {
			if (this.root && e) {
				const r = new ja(t, n), i = new Ua(Qa(e));
				return Za(this.root, e, new za(), r, i), r.schemas;
			}
			return [];
		}
	};
	function Qa(e, t = Ca.v2020_12) {
		let n = e.$schema;
		return n ? $a[n] ?? t : t;
	}
	function Za(e, t, n, r, i) {
		if (!e || !r.include(e)) return;
		if ("property" === e.type) return Za(e.valueNode, t, n, r, i);
		const s = e;
		switch (function() {
			function e(e) {
				return s.type === e || "integer" === e && "number" === s.type && s.isInteger;
			}
			Array.isArray(t.type) ? t.type.some(e) || n.problems.push({
				location: {
					offset: s.offset,
					length: s.length
				},
				message: t.errorMessage || ka("Incorrect type. Expected one of {0}.", t.type.join(", "))
			}) : t.type && (e(t.type) || n.problems.push({
				location: {
					offset: s.offset,
					length: s.length
				},
				message: t.errorMessage || ka("Incorrect type. Expected \"{0}\".", t.type)
			}));
			if (Array.isArray(t.allOf)) for (const h of t.allOf) {
				const e = new za(), t = r.newSub();
				Za(s, Ba(h), e, t, i), n.merge(e), r.merge(t);
			}
			const o = Ba(t.not);
			if (o) {
				const e = new za(), a = r.newSub();
				Za(s, o, e, a, i), e.hasProblems() || n.problems.push({
					location: {
						offset: s.offset,
						length: s.length
					},
					message: t.errorMessage || ka("Matches a schema that is not allowed.")
				});
				for (const t of a.schemas) t.inverted = !t.inverted, r.add(t);
			}
			const a = (e, t) => {
				const o = [];
				let a;
				for (const n of e) {
					const e = Ba(n), l = new za(), u = r.newSub();
					if (Za(s, e, l, u, i), l.hasProblems() || o.push(e), a) if (t || l.hasProblems() || a.validationResult.hasProblems()) {
						const t = l.compare(a.validationResult);
						t > 0 ? a = {
							schema: e,
							validationResult: l,
							matchingSchemas: u
						} : 0 === t && (a.matchingSchemas.merge(u), a.validationResult.mergeEnumValues(l));
					} else a.matchingSchemas.merge(u), a.validationResult.propertiesMatches += l.propertiesMatches, a.validationResult.propertiesValueMatches += l.propertiesValueMatches, a.validationResult.mergeProcessedProperties(l);
					else a = {
						schema: e,
						validationResult: l,
						matchingSchemas: u
					};
				}
				return o.length > 1 && t && n.problems.push({
					location: {
						offset: s.offset,
						length: 1
					},
					message: ka("Matches multiple schemas when only one must validate.")
				}), a && (n.merge(a.validationResult), r.merge(a.matchingSchemas)), o.length;
			};
			Array.isArray(t.anyOf) && a(t.anyOf, !1);
			Array.isArray(t.oneOf) && a(t.oneOf, !0);
			const l = (e) => {
				const t = new za(), o = r.newSub();
				Za(s, Ba(e), t, o, i), n.merge(t), r.merge(o);
			}, u = Ba(t.if);
			u && ((e, t, o) => {
				const a = Ba(e), u = new za(), c = r.newSub();
				Za(s, a, u, c, i), r.merge(c), n.mergeProcessedProperties(u), u.hasProblems() ? o && l(o) : t && l(t);
			})(u, Ba(t.then), Ba(t.else));
			if (Array.isArray(t.enum)) {
				const e = Ha(s);
				let r = !1;
				for (const n of t.enum) if (ua(e, n)) {
					r = !0;
					break;
				}
				n.enumValues = t.enum, n.enumValueMatch = r, r || n.problems.push({
					location: {
						offset: s.offset,
						length: s.length
					},
					code: _a.EnumValueMismatch,
					message: t.errorMessage || ka("Value is not accepted. Valid values: {0}.", t.enum.map((e) => JSON.stringify(e)).join(", "))
				});
			}
			ha(t.const) && (ua(Ha(s), t.const) ? n.enumValueMatch = !0 : (n.problems.push({
				location: {
					offset: s.offset,
					length: s.length
				},
				code: _a.EnumValueMismatch,
				message: t.errorMessage || ka("Value must be {0}.", JSON.stringify(t.const))
			}), n.enumValueMatch = !1), n.enumValues = [t.const]);
			let c = t.deprecationMessage;
			if (c || t.deprecated) {
				c = c || ka("Value is deprecated");
				let e = "property" === s.parent?.type ? s.parent : s;
				n.problems.push({
					location: {
						offset: e.offset,
						length: e.length
					},
					severity: Qs.Warning,
					message: c,
					code: _a.Deprecated
				});
			}
		}(), s.type) {
			case "object":
				(function(e) {
					const s = Object.create(null), o = /* @__PURE__ */ new Set();
					for (const t of e.properties) {
						const e = t.keyNode.value;
						s[e] = t.valueNode, o.add(e);
					}
					if (Array.isArray(t.required)) {
						for (const r of t.required) if (!s[r]) {
							const t = e.parent && "property" === e.parent.type && e.parent.keyNode, i = t ? {
								offset: t.offset,
								length: t.length
							} : {
								offset: e.offset,
								length: 1
							};
							n.problems.push({
								location: i,
								message: ka("Missing property \"{0}\".", r)
							});
						}
					}
					const a = (e) => {
						o.delete(e), n.processedProperties.add(e);
					};
					if (t.properties) for (const d of Object.keys(t.properties)) {
						a(d);
						const e = t.properties[d], o = s[d];
						if (o) if (da(e)) if (e) n.propertiesMatches++, n.propertiesValueMatches++;
						else {
							const e = o.parent;
							n.problems.push({
								location: {
									offset: e.keyNode.offset,
									length: e.keyNode.length
								},
								message: t.errorMessage || ka("Property {0} is not allowed.", d)
							});
						}
						else {
							const t = new za();
							Za(o, e, t, r, i), n.mergePropertyMatch(t);
						}
					}
					if (t.patternProperties) for (const d of Object.keys(t.patternProperties)) {
						const e = pa(d);
						if (e) {
							const l = [];
							for (const a of o) if (e.test(a)) {
								l.push(a);
								const e = s[a];
								if (e) {
									const s = t.patternProperties[d];
									if (da(s)) if (s) n.propertiesMatches++, n.propertiesValueMatches++;
									else {
										const r = e.parent;
										n.problems.push({
											location: {
												offset: r.keyNode.offset,
												length: r.keyNode.length
											},
											message: t.errorMessage || ka("Property {0} is not allowed.", a)
										});
									}
									else {
										const t = new za();
										Za(e, s, t, r, i), n.mergePropertyMatch(t);
									}
								}
							}
							l.forEach(a);
						}
					}
					const l = t.additionalProperties;
					if (void 0 !== l) for (const d of o) {
						a(d);
						const e = s[d];
						if (e) {
							if (!1 === l) {
								const r = e.parent;
								n.problems.push({
									location: {
										offset: r.keyNode.offset,
										length: r.keyNode.length
									},
									message: t.errorMessage || ka("Property {0} is not allowed.", d)
								});
							} else if (!0 !== l) {
								const t = new za();
								Za(e, l, t, r, i), n.mergePropertyMatch(t);
							}
						}
					}
					const u = t.unevaluatedProperties;
					if (void 0 !== u) {
						const e = [];
						for (const a of o) if (!n.processedProperties.has(a)) {
							e.push(a);
							const o = s[a];
							if (o) {
								if (!1 === u) {
									const e = o.parent;
									n.problems.push({
										location: {
											offset: e.keyNode.offset,
											length: e.keyNode.length
										},
										message: t.errorMessage || ka("Property {0} is not allowed.", a)
									});
								} else if (!0 !== u) {
									const e = new za();
									Za(o, u, e, r, i), n.mergePropertyMatch(e);
								}
							}
						}
						e.forEach(a);
					}
					ca(t.maxProperties) && e.properties.length > t.maxProperties && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("Object has more properties than limit of {0}.", t.maxProperties)
					});
					ca(t.minProperties) && e.properties.length < t.minProperties && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("Object has fewer properties than the required number of {0}", t.minProperties)
					});
					if (t.dependentRequired) for (const n in t.dependentRequired) {
						const e = s[n], r = t.dependentRequired[n];
						e && Array.isArray(r) && h(n, r);
					}
					if (t.dependentSchemas) for (const n in t.dependentSchemas) {
						const e = s[n], r = t.dependentSchemas[n];
						e && ma(r) && h(n, r);
					}
					if (t.dependencies) for (const n in t.dependencies) s[n] && h(n, t.dependencies[n]);
					const c = Ba(t.propertyNames);
					if (c) for (const t of e.properties) {
						const e = t.keyNode;
						e && Za(e, c, n, Wa.instance, i);
					}
					function h(t, o) {
						if (Array.isArray(o)) for (const r of o) s[r] ? n.propertiesValueMatches++ : n.problems.push({
							location: {
								offset: e.offset,
								length: e.length
							},
							message: ka("Object is missing property {0} required by property {1}.", r, t)
						});
						else {
							const t = Ba(o);
							if (t) {
								const s = new za();
								Za(e, t, s, r, i), n.mergePropertyMatch(s);
							}
						}
					}
				})(s);
				break;
			case "array":
				(function(e) {
					let s, o;
					i.schemaDraft >= Ca.v2020_12 ? (s = t.prefixItems, o = Array.isArray(t.items) ? void 0 : t.items) : (s = Array.isArray(t.items) ? t.items : void 0, o = Array.isArray(t.items) ? t.additionalItems : t.items);
					let a = 0;
					if (void 0 !== s) {
						const h = Math.min(s.length, e.items.length);
						for (; a < h; a++) {
							const d = Ba(s[a]), f = new za(), m = e.items[a];
							m && (Za(m, d, f, r, i), n.mergePropertyMatch(f)), n.processedProperties.add(String(a));
						}
					}
					if (void 0 !== o && a < e.items.length) if ("boolean" == typeof o) for (!1 === o && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("Array has too many items according to schema. Expected {0} or fewer.", a)
					}); a < e.items.length; a++) n.processedProperties.add(String(a)), n.propertiesValueMatches++;
					else for (; a < e.items.length; a++) {
						const g = new za();
						Za(e.items[a], o, g, r, i), n.mergePropertyMatch(g), n.processedProperties.add(String(a));
					}
					const l = Ba(t.contains);
					if (l) {
						let p = 0;
						for (let b = 0; b < e.items.length; b++) {
							const y = e.items[b], v = new za();
							Za(y, l, v, Wa.instance, i), v.hasProblems() || (p++, i.schemaDraft >= Ca.v2020_12 && n.processedProperties.add(String(b)));
						}
						0 !== p || ca(t.minContains) || n.problems.push({
							location: {
								offset: e.offset,
								length: e.length
							},
							message: t.errorMessage || ka("Array does not contain required item.")
						}), ca(t.minContains) && p < t.minContains && n.problems.push({
							location: {
								offset: e.offset,
								length: e.length
							},
							message: t.errorMessage || ka("Array has too few items that match the contains contraint. Expected {0} or more.", t.minContains)
						}), ca(t.maxContains) && p > t.maxContains && n.problems.push({
							location: {
								offset: e.offset,
								length: e.length
							},
							message: t.errorMessage || ka("Array has too many items that match the contains contraint. Expected {0} or less.", t.maxContains)
						});
					}
					const u = t.unevaluatedItems;
					if (void 0 !== u) for (let w = 0; w < e.items.length; w++) {
						if (!n.processedProperties.has(String(w))) if (!1 === u) n.problems.push({
							location: {
								offset: e.offset,
								length: e.length
							},
							message: ka("Item does not match any validation rule from the array.")
						});
						else {
							const _ = new za();
							Za(e.items[w], t.unevaluatedItems, _, r, i), n.mergePropertyMatch(_);
						}
						n.processedProperties.add(String(w)), n.propertiesValueMatches++;
					}
					ca(t.minItems) && e.items.length < t.minItems && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("Array has too few items. Expected {0} or more.", t.minItems)
					});
					ca(t.maxItems) && e.items.length > t.maxItems && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("Array has too many items. Expected {0} or fewer.", t.maxItems)
					});
					if (!0 === t.uniqueItems) {
						const C = Ha(e);
						function c() {
							for (let e = 0; e < C.length - 1; e++) {
								const t = C[e];
								for (let n = e + 1; n < C.length; n++) if (ua(t, C[n])) return !0;
							}
							return !1;
						}
						c() && n.problems.push({
							location: {
								offset: e.offset,
								length: e.length
							},
							message: ka("Array has duplicate items.")
						});
					}
				})(s);
				break;
			case "string":
				(function(e) {
					ca(t.minLength) && ba(e.value) < t.minLength && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("String is shorter than the minimum length of {0}.", t.minLength)
					});
					ca(t.maxLength) && ba(e.value) > t.maxLength && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("String is longer than the maximum length of {0}.", t.maxLength)
					});
					fa(t.pattern) && (pa(t.pattern)?.test(e.value) || n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: t.patternErrorMessage || t.errorMessage || ka("String does not match the pattern of \"{0}\".", t.pattern)
					}));
					if (t.format) switch (t.format) {
						case "uri":
						case "uri-reference":
							{
								let r;
								if (e.value) {
									const n = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/.exec(e.value);
									n ? n[2] || "uri" !== t.format || (r = ka("URI with a scheme is expected.")) : r = ka("URI is expected.");
								} else r = ka("URI expected.");
								r && n.problems.push({
									location: {
										offset: e.offset,
										length: e.length
									},
									message: t.patternErrorMessage || t.errorMessage || ka("String is not a URI: {0}", r)
								});
							}
							break;
						case "color-hex":
						case "date-time":
						case "date":
						case "time":
						case "email":
						case "hostname":
						case "ipv4":
						case "ipv6":
							const r = Ta[t.format];
							e.value && r.pattern.exec(e.value) || n.problems.push({
								location: {
									offset: e.offset,
									length: e.length
								},
								message: t.patternErrorMessage || t.errorMessage || r.errorMessage
							});
					}
				})(s);
				break;
			case "number": (function(e) {
				const r = e.value;
				function i(e) {
					const t = /^(-?\d+)(?:\.(\d+))?(?:e([-+]\d+))?$/.exec(e.toString());
					return t && {
						value: Number(t[1] + (t[2] || "")),
						multiplier: (t[2]?.length || 0) - (parseInt(t[3]) || 0)
					};
				}
				if (ca(t.multipleOf)) {
					let s = -1;
					if (Number.isInteger(t.multipleOf)) s = r % t.multipleOf;
					else {
						let e = i(t.multipleOf), n = i(r);
						if (e && n) {
							const t = 10 ** Math.abs(n.multiplier - e.multiplier);
							n.multiplier < e.multiplier ? n.value *= t : e.value *= t, s = n.value % e.value;
						}
					}
					0 !== s && n.problems.push({
						location: {
							offset: e.offset,
							length: e.length
						},
						message: ka("Value is not divisible by {0}.", t.multipleOf)
					});
				}
				function s(e, t) {
					return ca(t) ? t : da(t) && t ? e : void 0;
				}
				function o(e, t) {
					if (!da(t) || !t) return e;
				}
				const a = s(t.minimum, t.exclusiveMinimum);
				ca(a) && r <= a && n.problems.push({
					location: {
						offset: e.offset,
						length: e.length
					},
					message: ka("Value is below the exclusive minimum of {0}.", a)
				});
				const l = s(t.maximum, t.exclusiveMaximum);
				ca(l) && r >= l && n.problems.push({
					location: {
						offset: e.offset,
						length: e.length
					},
					message: ka("Value is above the exclusive maximum of {0}.", l)
				});
				const u = o(t.minimum, t.exclusiveMinimum);
				ca(u) && r < u && n.problems.push({
					location: {
						offset: e.offset,
						length: e.length
					},
					message: ka("Value is below the minimum of {0}.", u)
				});
				const c = o(t.maximum, t.exclusiveMaximum);
				ca(c) && r > c && n.problems.push({
					location: {
						offset: e.offset,
						length: e.length
					},
					message: ka("Value is above the maximum of {0}.", c)
				});
			})(s);
		}
		r.add({
			node: s,
			schema: t
		});
	}
	function Ya(e, t) {
		const n = [];
		let r = -1;
		const i = e.getText(), s = ks(i, !1), o = t && t.collectComments ? [] : void 0;
		function a() {
			for (;;) {
				const t = s.scan();
				switch (c(), t) {
					case 12:
					case 13:
						Array.isArray(o) && o.push($s.create(e.positionAt(s.getTokenOffset()), e.positionAt(s.getTokenOffset() + s.getTokenLength())));
						break;
					case 15:
					case 14: break;
					default: return t;
				}
			}
		}
		function l(t, i, s, o, a = Qs.Error) {
			if (0 === n.length || s !== r) {
				const l = $s.create(e.positionAt(s), e.positionAt(o));
				n.push(eo.create(l, t, a, i, e.languageId)), r = s;
			}
		}
		function u(e, t, n = void 0, r = [], o = []) {
			let u = s.getTokenOffset(), c = s.getTokenOffset() + s.getTokenLength();
			if (u === c && u > 0) {
				for (u--; u > 0 && /\s/.test(i.charAt(u));) u--;
				c = u + 1;
			}
			if (l(e, t, u, c), n && h(n, !1), r.length + o.length > 0) {
				let e = s.getToken();
				for (; 17 !== e;) {
					if (-1 !== r.indexOf(e)) {
						a();
						break;
					}
					if (-1 !== o.indexOf(e)) break;
					e = a();
				}
			}
			return n;
		}
		function c() {
			switch (s.getTokenError()) {
				case 4: return u(ka("Invalid unicode sequence in string."), _a.InvalidUnicode), !0;
				case 5: return u(ka("Invalid escape character in string."), _a.InvalidEscapeCharacter), !0;
				case 3: return u(ka("Unexpected end of number."), _a.UnexpectedEndOfNumber), !0;
				case 1: return u(ka("Unexpected end of comment."), _a.UnexpectedEndOfComment), !0;
				case 2: return u(ka("Unexpected end of string."), _a.UnexpectedEndOfString), !0;
				case 6: return u(ka("Invalid characters in string. Control characters must be escaped."), _a.InvalidCharacter), !0;
			}
			return !1;
		}
		function h(e, t) {
			return e.length = s.getTokenOffset() + s.getTokenLength() - e.offset, t && a(), e;
		}
		const d = new Da(void 0, 0, 0);
		function f(t, n) {
			const r = new qa(t, s.getTokenOffset(), d);
			let i = m(r);
			if (!i) {
				if (16 !== s.getToken()) return;
				{
					u(ka("Property keys must be doublequoted"), _a.PropertyKeysMustBeDoublequoted);
					const e = new Da(r, s.getTokenOffset(), s.getTokenLength());
					e.value = s.getTokenValue(), i = e, a();
				}
			}
			if (r.keyNode = i, "//" !== i.value) {
				const e = n[i.value];
				e ? (l(ka("Duplicate object key"), _a.DuplicateKey, r.keyNode.offset, r.keyNode.offset + r.keyNode.length, Qs.Warning), ma(e) && l(ka("Duplicate object key"), _a.DuplicateKey, e.keyNode.offset, e.keyNode.offset + e.keyNode.length, Qs.Warning), n[i.value] = !0) : n[i.value] = r;
			}
			if (6 === s.getToken()) r.colonOffset = s.getTokenOffset(), a();
			else if (u(ka("Colon expected"), _a.ColonExpected), 10 === s.getToken() && e.positionAt(i.offset + i.length).line < e.positionAt(s.getTokenOffset()).line) return r.length = i.length, r;
			const o = g(r);
			return o ? (r.valueNode = o, r.length = o.offset + o.length - r.offset, r) : u(ka("Value expected"), _a.ValueExpected, r, [], [2, 5]);
		}
		function m(e) {
			if (10 !== s.getToken()) return;
			const t = new Da(e, s.getTokenOffset());
			return t.value = s.getTokenValue(), h(t, !0);
		}
		function g(e) {
			return function(e) {
				if (3 !== s.getToken()) return;
				const t = new Va(e, s.getTokenOffset());
				a();
				let n = !1;
				for (; 4 !== s.getToken() && 17 !== s.getToken();) {
					if (5 === s.getToken()) {
						n || u(ka("Value expected"), _a.ValueExpected);
						const e = s.getTokenOffset();
						if (a(), 4 === s.getToken()) {
							n && l(ka("Trailing comma"), _a.TrailingComma, e, e + 1);
							continue;
						}
					} else n && u(ka("Expected comma"), _a.CommaExpected);
					const e = g(t);
					e ? t.items.push(e) : u(ka("Value expected"), _a.ValueExpected, void 0, [], [4, 5]), n = !0;
				}
				return 4 !== s.getToken() ? u(ka("Expected comma or closing bracket"), _a.CommaOrCloseBacketExpected, t) : h(t, !0);
			}(e) || function(e) {
				if (1 !== s.getToken()) return;
				const t = new Ka(e, s.getTokenOffset()), n = Object.create(null);
				a();
				let r = !1;
				for (; 2 !== s.getToken() && 17 !== s.getToken();) {
					if (5 === s.getToken()) {
						r || u(ka("Property expected"), _a.PropertyExpected);
						const e = s.getTokenOffset();
						if (a(), 2 === s.getToken()) {
							r && l(ka("Trailing comma"), _a.TrailingComma, e, e + 1);
							continue;
						}
					} else r && u(ka("Expected comma"), _a.CommaExpected);
					const e = f(t, n);
					e ? t.properties.push(e) : u(ka("Property expected"), _a.PropertyExpected, void 0, [], [2, 5]), r = !0;
				}
				return 2 !== s.getToken() ? u(ka("Expected comma or closing brace"), _a.CommaOrCloseBraceExpected, t) : h(t, !0);
			}(e) || m(e) || function(e) {
				if (11 !== s.getToken()) return;
				const t = new Fa(e, s.getTokenOffset());
				if (0 === s.getTokenError()) {
					const e = s.getTokenValue();
					try {
						const n = JSON.parse(e);
						if (!ca(n)) return u(ka("Invalid number format."), _a.Undefined, t);
						t.value = n;
					} catch (Jl) {
						return u(ka("Invalid number format."), _a.Undefined, t);
					}
					t.isInteger = -1 === e.indexOf(".");
				}
				return h(t, !0);
			}(e) || function(e) {
				switch (s.getToken()) {
					case 7: return h(new Ia(e, s.getTokenOffset()), !0);
					case 8: return h(new Pa(e, !0, s.getTokenOffset()), !0);
					case 9: return h(new Pa(e, !1, s.getTokenOffset()), !0);
					default: return;
				}
			}(e);
		}
		let p;
		return 17 !== a() && (p = g(p), p ? 17 !== s.getToken() && u(ka("End of file expected."), _a.Undefined) : u(ka("Expected a JSON object, array or literal."), _a.Undefined)), new Xa(p, n, o);
	}
	function el(e, t, n) {
		if (null !== e && "object" == typeof e) {
			const r = t + "	";
			if (Array.isArray(e)) {
				if (0 === e.length) return "[]";
				let i = "[\n";
				for (let t = 0; t < e.length; t++) i += r + el(e[t], r, n), t < e.length - 1 && (i += ","), i += "\n";
				return i += t + "]", i;
			}
			{
				const i = Object.keys(e);
				if (0 === i.length) return "{}";
				let s = "{\n";
				for (let t = 0; t < i.length; t++) {
					const o = i[t];
					s += r + JSON.stringify(o) + ": " + el(e[o], r, n), t < i.length - 1 && (s += ","), s += "\n";
				}
				return s += t + "}", s;
			}
		}
		return n(e);
	}
	var tl = class {
		constructor(e, t = [], n = Promise, r = {}) {
			this.schemaService = e, this.contributions = t, this.promiseConstructor = n, this.clientCapabilities = r;
		}
		doResolve(e) {
			for (let t = this.contributions.length - 1; t >= 0; t--) {
				const n = this.contributions[t].resolveCompletion;
				if (n) {
					const t = n(e);
					if (t) return t;
				}
			}
			return this.promiseConstructor.resolve(e);
		}
		doComplete(e, t, n) {
			const r = {
				items: [],
				isIncomplete: !1
			}, i = e.getText(), s = e.offsetAt(t);
			let o = n.getNodeFromOffset(s, !0);
			if (this.isInComment(e, o ? o.offset : 0, s)) return Promise.resolve(r);
			if (o && s === o.offset + o.length && s > 0) {
				const e = i[s - 1];
				("object" === o.type && "}" === e || "array" === o.type && "]" === e) && (o = o.parent);
			}
			const a = this.getCurrentWord(e, s);
			let l;
			if (!o || "string" !== o.type && "number" !== o.type && "boolean" !== o.type && "null" !== o.type) {
				let n = s - a.length;
				n > 0 && "\"" === i[n - 1] && n--, l = $s.create(e.positionAt(n), t);
			} else l = $s.create(e.positionAt(o.offset), e.positionAt(o.offset + o.length));
			const u = /* @__PURE__ */ new Map(), c = {
				add: (e) => {
					let t = e.label;
					const n = u.get(t);
					if (n) n.documentation || (n.documentation = e.documentation), n.detail || (n.detail = e.detail), n.labelDetails || (n.labelDetails = e.labelDetails);
					else {
						if (t = t.replace(/[\n]/g, "↵"), t.length > 60) {
							const e = t.substr(0, 57).trim() + "...";
							u.has(e) || (t = e);
						}
						e.textEdit = no.replace(l, e.insertText), e.label = t, u.set(t, e), r.items.push(e);
					}
				},
				setAsIncomplete: () => {
					r.isIncomplete = !0;
				},
				error: (e) => {},
				getNumberOfProposals: () => r.items.length
			};
			return this.schemaService.getSchemaForResource(e.uri, n).then((t) => {
				const h = [];
				let d, f = !0, m = "";
				if (o && "string" === o.type) {
					const e = o.parent;
					e && "property" === e.type && e.keyNode === o && (f = !e.valueNode, d = e, m = i.substr(o.offset + 1, o.length - 2), e && (o = e.parent));
				}
				if (o && "object" === o.type) {
					if (o.offset === s) return r;
					o.properties.forEach((e) => {
						d && d === e || u.set(e.keyNode.value, Lo.create("__"));
					});
					let g = "";
					f && (g = this.evaluateSeparatorAfter(e, e.offsetAt(l.end))), t ? this.getPropertyCompletions(t, n, o, f, g, c) : this.getSchemaLessPropertyCompletions(n, o, m, c);
					const p = Ga(o);
					this.contributions.forEach((t) => {
						const n = t.collectPropertyCompletions(e.uri, p, a, f, "" === g, c);
						n && h.push(n);
					}), !t && a.length > 0 && "\"" !== i.charAt(s - a.length - 1) && (c.add({
						kind: yo.Property,
						label: this.getLabelForValue(a),
						insertText: this.getInsertTextForProperty(a, void 0, !1, g),
						insertTextFormat: vo.Snippet,
						documentation: ""
					}), c.setAsIncomplete());
				}
				const g = {};
				return t ? this.getValueCompletions(t, n, o, s, e, c, g) : this.getSchemaLessValueCompletions(n, o, s, e, c), this.contributions.length > 0 && this.getContributedValueCompletions(n, o, s, e, c, h), this.promiseConstructor.all(h).then(() => {
					if (0 === c.getNumberOfProposals()) {
						let t = s;
						!o || "string" !== o.type && "number" !== o.type && "boolean" !== o.type && "null" !== o.type || (t = o.offset + o.length);
						const n = this.evaluateSeparatorAfter(e, t);
						this.addFillerValueCompletions(g, n, c);
					}
					return r;
				});
			});
		}
		getPropertyCompletions(e, t, n, r, i, s) {
			t.getMatchingSchemas(e.schema, n.offset).forEach((e) => {
				if (e.node === n && !e.inverted) {
					const t = e.schema.properties;
					t && Object.keys(t).forEach((e) => {
						const n = t[e];
						if ("object" == typeof n && !n.deprecationMessage && !n.doNotSuggest) {
							const t = {
								kind: yo.Property,
								label: e,
								insertText: this.getInsertTextForProperty(e, n, r, i),
								insertTextFormat: vo.Snippet,
								filterText: this.getFilterTextForValue(e),
								documentation: this.fromMarkup(n.markdownDescription) || n.description || ""
							};
							void 0 !== n.suggestSortText && (t.sortText = n.suggestSortText), t.insertText && ga(t.insertText, `$1${i}`) && (t.command = {
								title: "Suggest",
								command: "editor.action.triggerSuggest"
							}), s.add(t);
						}
					});
					const n = e.schema.propertyNames;
					if ("object" == typeof n && !n.deprecationMessage && !n.doNotSuggest) {
						const e = (e, t = void 0) => {
							const o = {
								kind: yo.Property,
								label: e,
								insertText: this.getInsertTextForProperty(e, void 0, r, i),
								insertTextFormat: vo.Snippet,
								filterText: this.getFilterTextForValue(e),
								documentation: t || this.fromMarkup(n.markdownDescription) || n.description || ""
							};
							void 0 !== n.suggestSortText && (o.sortText = n.suggestSortText), o.insertText && ga(o.insertText, `$1${i}`) && (o.command = {
								title: "Suggest",
								command: "editor.action.triggerSuggest"
							}), s.add(o);
						};
						if (n.enum) for (let t = 0; t < n.enum.length; t++) {
							let r;
							n.markdownEnumDescriptions && t < n.markdownEnumDescriptions.length ? r = this.fromMarkup(n.markdownEnumDescriptions[t]) : n.enumDescriptions && t < n.enumDescriptions.length && (r = n.enumDescriptions[t]), e(n.enum[t], r);
						}
						n.const && e(n.const);
					}
				}
			});
		}
		getSchemaLessPropertyCompletions(e, t, n, r) {
			const i = (e) => {
				e.properties.forEach((e) => {
					const t = e.keyNode.value;
					r.add({
						kind: yo.Property,
						label: t,
						insertText: this.getInsertTextForValue(t, ""),
						insertTextFormat: vo.Snippet,
						filterText: this.getFilterTextForValue(t),
						documentation: ""
					});
				});
			};
			if (t.parent) if ("property" === t.parent.type) {
				const n = t.parent.keyNode.value;
				e.visit((e) => ("property" === e.type && e !== t.parent && e.keyNode.value === n && e.valueNode && "object" === e.valueNode.type && i(e.valueNode), !0));
			} else "array" === t.parent.type && t.parent.items.forEach((e) => {
				"object" === e.type && e !== t && i(e);
			});
			else "object" === t.type && r.add({
				kind: yo.Property,
				label: "$schema",
				insertText: this.getInsertTextForProperty("$schema", void 0, !0, ""),
				insertTextFormat: vo.Snippet,
				documentation: "",
				filterText: this.getFilterTextForValue("$schema")
			});
		}
		getSchemaLessValueCompletions(e, t, n, r, i) {
			let s = n;
			if (!t || "string" !== t.type && "number" !== t.type && "boolean" !== t.type && "null" !== t.type || (s = t.offset + t.length, t = t.parent), !t) return i.add({
				kind: this.getSuggestionKind("object"),
				label: "Empty object",
				insertText: this.getInsertTextForValue({}, ""),
				insertTextFormat: vo.Snippet,
				documentation: ""
			}), void i.add({
				kind: this.getSuggestionKind("array"),
				label: "Empty array",
				insertText: this.getInsertTextForValue([], ""),
				insertTextFormat: vo.Snippet,
				documentation: ""
			});
			const o = this.evaluateSeparatorAfter(r, s), a = (e) => {
				e.parent && !Ja(e.parent, n, !0) && i.add({
					kind: this.getSuggestionKind(e.type),
					label: this.getLabelTextForMatchingNode(e, r),
					insertText: this.getInsertTextForMatchingNode(e, r, o),
					insertTextFormat: vo.Snippet,
					documentation: ""
				}), "boolean" === e.type && this.addBooleanValueCompletion(!e.value, o, i);
			};
			if ("property" === t.type && n > (t.colonOffset || 0)) {
				const r = t.valueNode;
				if (r && (n > r.offset + r.length || "object" === r.type || "array" === r.type)) return;
				const s = t.keyNode.value;
				e.visit((e) => ("property" === e.type && e.keyNode.value === s && e.valueNode && a(e.valueNode), !0)), "$schema" === s && t.parent && !t.parent.parent && this.addDollarSchemaCompletions(o, i);
			}
			if ("array" === t.type) if (t.parent && "property" === t.parent.type) {
				const n = t.parent.keyNode.value;
				e.visit((e) => ("property" === e.type && e.keyNode.value === n && e.valueNode && "array" === e.valueNode.type && e.valueNode.items.forEach(a), !0));
			} else t.items.forEach(a);
		}
		getValueCompletions(e, t, n, r, i, s, o) {
			let a, l, u = r;
			if (!n || "string" !== n.type && "number" !== n.type && "boolean" !== n.type && "null" !== n.type || (u = n.offset + n.length, l = n, n = n.parent), n) {
				if ("property" === n.type && r > (n.colonOffset || 0)) {
					const e = n.valueNode;
					if (e && r > e.offset + e.length) return;
					a = n.keyNode.value, n = n.parent;
				}
				if (n && (void 0 !== a || "array" === n.type)) {
					const c = this.evaluateSeparatorAfter(i, u), h = t.getMatchingSchemas(e.schema, n.offset, l);
					for (const e of h) if (e.node === n && !e.inverted && e.schema) {
						if ("array" === n.type && e.schema.items) {
							let t = s;
							if (e.schema.uniqueItems) {
								const e = /* @__PURE__ */ new Set();
								n.children.forEach((t) => {
									"array" !== t.type && "object" !== t.type && e.add(this.getLabelForValue(Ha(t)));
								}), t = {
									...s,
									add(t) {
										e.has(t.label) || s.add(t);
									}
								};
							}
							if (Array.isArray(e.schema.items)) {
								const s = this.findItemAtOffset(n, i, r);
								s < e.schema.items.length && this.addSchemaValueCompletions(e.schema.items[s], c, t, o);
							} else this.addSchemaValueCompletions(e.schema.items, c, t, o);
						}
						if (void 0 !== a) {
							let t = !1;
							if (e.schema.properties) {
								const n = e.schema.properties[a];
								n && (t = !0, this.addSchemaValueCompletions(n, c, s, o));
							}
							if (e.schema.patternProperties && !t) {
								for (const n of Object.keys(e.schema.patternProperties)) if (pa(n)?.test(a)) {
									t = !0;
									const r = e.schema.patternProperties[n];
									this.addSchemaValueCompletions(r, c, s, o);
								}
							}
							if (e.schema.additionalProperties && !t) {
								const t = e.schema.additionalProperties;
								this.addSchemaValueCompletions(t, c, s, o);
							}
						}
					}
					"$schema" !== a || n.parent || this.addDollarSchemaCompletions(c, s), o.boolean && (this.addBooleanValueCompletion(!0, c, s), this.addBooleanValueCompletion(!1, c, s)), o.null && this.addNullValueCompletion(c, s);
				}
			} else this.addSchemaValueCompletions(e.schema, "", s, o);
		}
		getContributedValueCompletions(e, t, n, r, i, s) {
			if (t) {
				if ("string" !== t.type && "number" !== t.type && "boolean" !== t.type && "null" !== t.type || (t = t.parent), t && "property" === t.type && n > (t.colonOffset || 0)) {
					const e = t.keyNode.value, o = t.valueNode;
					if ((!o || n <= o.offset + o.length) && t.parent) {
						const n = Ga(t.parent);
						this.contributions.forEach((t) => {
							const o = t.collectValueCompletions(r.uri, n, e, i);
							o && s.push(o);
						});
					}
				}
			} else this.contributions.forEach((e) => {
				const t = e.collectDefaultCompletions(r.uri, i);
				t && s.push(t);
			});
		}
		addSchemaValueCompletions(e, t, n, r) {
			"object" == typeof e && (this.addEnumValueCompletions(e, t, n), this.addDefaultValueCompletions(e, t, n), this.collectTypes(e, r), Array.isArray(e.allOf) && e.allOf.forEach((e) => this.addSchemaValueCompletions(e, t, n, r)), Array.isArray(e.anyOf) && e.anyOf.forEach((e) => this.addSchemaValueCompletions(e, t, n, r)), Array.isArray(e.oneOf) && e.oneOf.forEach((e) => this.addSchemaValueCompletions(e, t, n, r)));
		}
		addDefaultValueCompletions(e, t, n, r = 0) {
			let i = !1;
			if (ha(e.default)) {
				let s = e.type, o = e.default;
				for (let e = r; e > 0; e--) o = [o], s = "array";
				const a = {
					kind: this.getSuggestionKind(s),
					label: this.getLabelForValue(o),
					insertText: this.getInsertTextForValue(o, t),
					insertTextFormat: vo.Snippet
				};
				this.doesSupportsLabelDetails() ? a.labelDetails = { description: ka("Default value") } : a.detail = ka("Default value"), n.add(a), i = !0;
			}
			Array.isArray(e.examples) && e.examples.forEach((s) => {
				let o = e.type, a = s;
				for (let e = r; e > 0; e--) a = [a], o = "array";
				n.add({
					kind: this.getSuggestionKind(o),
					label: this.getLabelForValue(a),
					insertText: this.getInsertTextForValue(a, t),
					insertTextFormat: vo.Snippet
				}), i = !0;
			}), Array.isArray(e.defaultSnippets) && e.defaultSnippets.forEach((s) => {
				let o, a, l = e.type, u = s.body, c = s.label;
				if (ha(u)) {
					e.type;
					for (let e = r; e > 0; e--) u = [u];
					o = this.getInsertTextForSnippetValue(u, t), a = this.getFilterTextForSnippetValue(u), c = c || this.getLabelForSnippetValue(u);
				} else {
					if ("string" != typeof s.bodyText) return;
					{
						let e = "", n = "", i = "";
						for (let t = r; t > 0; t--) e = e + i + "[\n", n = n + "\n" + i + "]", i += "	", l = "array";
						o = e + i + s.bodyText.split("\n").join("\n" + i) + n + t, c = c || o, a = o.replace(/[\n]/g, "");
					}
				}
				n.add({
					kind: this.getSuggestionKind(l),
					label: c,
					documentation: this.fromMarkup(s.markdownDescription) || s.description,
					insertText: o,
					insertTextFormat: vo.Snippet,
					filterText: a
				}), i = !0;
			}), !i && "object" == typeof e.items && !Array.isArray(e.items) && r < 5 && this.addDefaultValueCompletions(e.items, t, n, r + 1);
		}
		addEnumValueCompletions(e, t, n) {
			if (ha(e.const) && n.add({
				kind: this.getSuggestionKind(e.type),
				label: this.getLabelForValue(e.const),
				insertText: this.getInsertTextForValue(e.const, t),
				insertTextFormat: vo.Snippet,
				documentation: this.fromMarkup(e.markdownDescription) || e.description
			}), Array.isArray(e.enum)) for (let r = 0, i = e.enum.length; r < i; r++) {
				const i = e.enum[r];
				let s = this.fromMarkup(e.markdownDescription) || e.description;
				e.markdownEnumDescriptions && r < e.markdownEnumDescriptions.length && this.doesSupportMarkdown() ? s = this.fromMarkup(e.markdownEnumDescriptions[r]) : e.enumDescriptions && r < e.enumDescriptions.length && (s = e.enumDescriptions[r]), n.add({
					kind: this.getSuggestionKind(e.type),
					label: this.getLabelForValue(i),
					insertText: this.getInsertTextForValue(i, t),
					insertTextFormat: vo.Snippet,
					documentation: s
				});
			}
		}
		collectTypes(e, t) {
			if (Array.isArray(e.enum) || ha(e.const)) return;
			const n = e.type;
			Array.isArray(n) ? n.forEach((e) => t[e] = !0) : n && (t[n] = !0);
		}
		addFillerValueCompletions(e, t, n) {
			e.object && n.add({
				kind: this.getSuggestionKind("object"),
				label: "{}",
				insertText: this.getInsertTextForGuessedValue({}, t),
				insertTextFormat: vo.Snippet,
				detail: ka("New object"),
				documentation: ""
			}), e.array && n.add({
				kind: this.getSuggestionKind("array"),
				label: "[]",
				insertText: this.getInsertTextForGuessedValue([], t),
				insertTextFormat: vo.Snippet,
				detail: ka("New array"),
				documentation: ""
			});
		}
		addBooleanValueCompletion(e, t, n) {
			n.add({
				kind: this.getSuggestionKind("boolean"),
				label: e ? "true" : "false",
				insertText: this.getInsertTextForValue(e, t),
				insertTextFormat: vo.Snippet,
				documentation: ""
			});
		}
		addNullValueCompletion(e, t) {
			t.add({
				kind: this.getSuggestionKind("null"),
				label: "null",
				insertText: "null" + e,
				insertTextFormat: vo.Snippet,
				documentation: ""
			});
		}
		addDollarSchemaCompletions(e, t) {
			this.schemaService.getRegisteredSchemaIds((e) => "http" === e || "https" === e).forEach((n) => {
				n.startsWith("http://json-schema.org/draft-") && (n += "#"), t.add({
					kind: yo.Module,
					label: this.getLabelForValue(n),
					filterText: this.getFilterTextForValue(n),
					insertText: this.getInsertTextForValue(n, e),
					insertTextFormat: vo.Snippet,
					documentation: ""
				});
			});
		}
		getLabelForValue(e) {
			return JSON.stringify(e);
		}
		getValueFromLabel(e) {
			return JSON.parse(e);
		}
		getFilterTextForValue(e) {
			return JSON.stringify(e);
		}
		getFilterTextForSnippetValue(e) {
			return JSON.stringify(e).replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1");
		}
		getLabelForSnippetValue(e) {
			return JSON.stringify(e).replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1");
		}
		getInsertTextForPlainText(e) {
			return e.replace(/[\\\$\}]/g, "\\$&");
		}
		getInsertTextForValue(e, t) {
			const n = JSON.stringify(e, null, "	");
			return "{}" === n ? "{$1}" + t : "[]" === n ? "[$1]" + t : this.getInsertTextForPlainText(n + t);
		}
		getInsertTextForSnippetValue(e, t) {
			return el(e, "", (e) => "string" == typeof e && "^" === e[0] ? e.substr(1) : JSON.stringify(e)) + t;
		}
		getInsertTextForGuessedValue(e, t) {
			switch (typeof e) {
				case "object": return null === e ? "${1:null}" + t : this.getInsertTextForValue(e, t);
				case "string":
					let n = JSON.stringify(e);
					return n = n.substr(1, n.length - 2), n = this.getInsertTextForPlainText(n), "\"${1:" + n + "}\"" + t;
				case "number":
				case "boolean": return "${1:" + JSON.stringify(e) + "}" + t;
			}
			return this.getInsertTextForValue(e, t);
		}
		getSuggestionKind(e) {
			if (Array.isArray(e)) {
				const t = e;
				e = t.length > 0 ? t[0] : void 0;
			}
			if (!e) return yo.Value;
			switch (e) {
				case "string":
				default: return yo.Value;
				case "object": return yo.Module;
				case "property": return yo.Property;
			}
		}
		getLabelTextForMatchingNode(e, t) {
			switch (e.type) {
				case "array": return "[]";
				case "object": return "{}";
				default: return t.getText().substr(e.offset, e.length);
			}
		}
		getInsertTextForMatchingNode(e, t, n) {
			switch (e.type) {
				case "array": return this.getInsertTextForValue([], n);
				case "object": return this.getInsertTextForValue({}, n);
				default:
					const r = t.getText().substr(e.offset, e.length) + n;
					return this.getInsertTextForPlainText(r);
			}
		}
		getInsertTextForProperty(e, t, n, r) {
			const i = this.getInsertTextForValue(e, "");
			if (!n) return i;
			const s = i + ": ";
			let o, a = 0;
			if (t) {
				if (Array.isArray(t.defaultSnippets)) {
					if (1 === t.defaultSnippets.length) {
						const e = t.defaultSnippets[0].body;
						ha(e) && (o = this.getInsertTextForSnippetValue(e, ""));
					}
					a += t.defaultSnippets.length;
				}
				if (t.enum && (o || 1 !== t.enum.length || (o = this.getInsertTextForGuessedValue(t.enum[0], "")), a += t.enum.length), ha(t.const) && (o || (o = this.getInsertTextForGuessedValue(t.const, "")), a++), ha(t.default) && (o || (o = this.getInsertTextForGuessedValue(t.default, "")), a++), Array.isArray(t.examples) && t.examples.length && (o || (o = this.getInsertTextForGuessedValue(t.examples[0], "")), a += t.examples.length), 0 === a) {
					let e = Array.isArray(t.type) ? t.type[0] : t.type;
					switch (e || (t.properties ? e = "object" : t.items && (e = "array")), e) {
						case "boolean":
							o = "$1";
							break;
						case "string":
							o = "\"$1\"";
							break;
						case "object":
							o = "{$1}";
							break;
						case "array":
							o = "[$1]";
							break;
						case "number":
						case "integer":
							o = "${1:0}";
							break;
						case "null":
							o = "${1:null}";
							break;
						default: return i;
					}
				}
			}
			return (!o || a > 1) && (o = "$1"), s + o + r;
		}
		getCurrentWord(e, t) {
			let n = t - 1;
			const r = e.getText();
			for (; n >= 0 && -1 === " 	\n\r\v\":{[,]}".indexOf(r.charAt(n));) n--;
			return r.substring(n + 1, t);
		}
		evaluateSeparatorAfter(e, t) {
			const n = ks(e.getText(), !0);
			switch (n.setPosition(t), n.scan()) {
				case 5:
				case 2:
				case 4:
				case 17: return "";
				default: return ",";
			}
		}
		findItemAtOffset(e, t, n) {
			const r = ks(t.getText(), !0), i = e.items;
			for (let s = i.length - 1; s >= 0; s--) {
				const e = i[s];
				if (n > e.offset + e.length) return r.setPosition(e.offset + e.length), 5 === r.scan() && n >= r.getTokenOffset() + r.getTokenLength() ? s + 1 : s;
				if (n >= e.offset) return s;
			}
			return 0;
		}
		isInComment(e, t, n) {
			const r = ks(e.getText(), !1);
			r.setPosition(t);
			let i = r.scan();
			for (; 17 !== i && r.getTokenOffset() + r.getTokenLength() < n;) i = r.scan();
			return (12 === i || 13 === i) && r.getTokenOffset() <= n;
		}
		fromMarkup(e) {
			if (e && this.doesSupportMarkdown()) return {
				kind: po.Markdown,
				value: e
			};
		}
		doesSupportMarkdown() {
			if (!ha(this.supportsMarkdown)) {
				const e = this.clientCapabilities.textDocument?.completion?.completionItem?.documentationFormat;
				this.supportsMarkdown = Array.isArray(e) && -1 !== e.indexOf(po.Markdown);
			}
			return this.supportsMarkdown;
		}
		doesSupportsCommitCharacters() {
			return ha(this.supportsCommitCharacters) || (this.labelDetailsSupport = this.clientCapabilities.textDocument?.completion?.completionItem?.commitCharactersSupport), this.supportsCommitCharacters;
		}
		doesSupportsLabelDetails() {
			return ha(this.labelDetailsSupport) || (this.labelDetailsSupport = this.clientCapabilities.textDocument?.completion?.completionItem?.labelDetailsSupport), this.labelDetailsSupport;
		}
	}, nl = class {
		constructor(e, t = [], n) {
			this.schemaService = e, this.contributions = t, this.promise = n || Promise;
		}
		doHover(e, t, n) {
			const r = e.offsetAt(t);
			let i = n.getNodeFromOffset(r);
			if (!i || ("object" === i.type || "array" === i.type) && r > i.offset + 1 && r < i.offset + i.length - 1) return this.promise.resolve(null);
			const s = i;
			if ("string" === i.type) {
				const e = i.parent;
				if (e && "property" === e.type && e.keyNode === i && (i = e.valueNode, !i)) return this.promise.resolve(null);
			}
			const o = $s.create(e.positionAt(s.offset), e.positionAt(s.offset + s.length)), a = (e) => ({
				contents: e,
				range: o
			}), l = Ga(i);
			for (let u = this.contributions.length - 1; u >= 0; u--) {
				const t = this.contributions[u].getInfoContribution(e.uri, l);
				if (t) return t.then((e) => a(e));
			}
			return this.schemaService.getSchemaForResource(e.uri, n).then((e) => {
				if (e && i) {
					let r, s, o, l;
					n.getMatchingSchemas(e.schema, i.offset).every((e) => {
						if (e.node === i && !e.inverted && e.schema && (r = r || e.schema.title, s = s || e.schema.markdownDescription || rl(e.schema.description), e.schema.enum)) {
							const t = e.schema.enum.indexOf(Ha(i));
							e.schema.markdownEnumDescriptions ? o = e.schema.markdownEnumDescriptions[t] : e.schema.enumDescriptions && (o = rl(e.schema.enumDescriptions[t])), o && (l = e.schema.enum[t], "string" != typeof l && (l = JSON.stringify(l)));
						}
						return !0;
					});
					let u = "";
					return r && (u = rl(r)), s && (u.length > 0 && (u += "\n\n"), u += s), o && (u.length > 0 && (u += "\n\n"), u += `\`${t = l, -1 !== t.indexOf("`") ? "`` " + t + " ``" : t}\`: ${o}`), a([u]);
				}
				var t;
				return null;
			});
		}
	};
	function rl(e) {
		if (e) return e.replace(/([^\n\r])(\r?\n)([^\n\r])/gm, "$1\n\n$3").replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
	}
	var il = class {
		constructor(e, t) {
			this.jsonSchemaService = e, this.promise = t, this.validationEnabled = !0;
		}
		configure(e) {
			e && (this.validationEnabled = !1 !== e.validate, this.commentSeverity = e.allowComments ? void 0 : Qs.Error);
		}
		doValidation(e, t, n, r) {
			if (!this.validationEnabled) return this.promise.resolve([]);
			const i = [], s = {}, o = (e) => {
				const t = e.range.start.line + " " + e.range.start.character + " " + e.message;
				s[t] || (s[t] = !0, i.push(e));
			}, a = (r) => {
				let s = n?.trailingCommas ? ll(n.trailingCommas) : Qs.Error, a = n?.comments ? ll(n.comments) : this.commentSeverity, l = n?.schemaValidation ? ll(n.schemaValidation) : Qs.Warning, u = n?.schemaRequest ? ll(n.schemaRequest) : Qs.Warning;
				if (r) {
					const i = (n, r) => {
						if (t.root && u) {
							const i = t.root, s = "object" === i.type ? i.properties[0] : void 0;
							if (s && "$schema" === s.keyNode.value) {
								const t = s.valueNode || s, i = $s.create(e.positionAt(t.offset), e.positionAt(t.offset + t.length));
								o(eo.create(i, n, u, r));
							} else {
								const t = $s.create(e.positionAt(i.offset), e.positionAt(i.offset + 1));
								o(eo.create(t, n, u, r));
							}
						}
					};
					if (r.errors.length) i(r.errors[0], _a.SchemaResolveError);
					else if (l) {
						for (const e of r.warnings) i(e, _a.SchemaUnsupportedFeature);
						const s = t.validate(e, r.schema, l, n?.schemaDraft);
						s && s.forEach(o);
					}
					ol(r.schema) && (a = void 0), al(r.schema) && (s = void 0);
				}
				for (const e of t.syntaxErrors) {
					if (e.code === _a.TrailingComma) {
						if ("number" != typeof s) continue;
						e.severity = s;
					}
					o(e);
				}
				if ("number" == typeof a) {
					const e = ka("Comments are not permitted in JSON.");
					t.comments.forEach((t) => {
						o(eo.create(t, e, a, _a.CommentNotPermitted));
					});
				}
				return i;
			};
			if (r) {
				const e = r.id || "schemaservice://untitled/" + sl++;
				return this.jsonSchemaService.registerExternalSchema({
					uri: e,
					schema: r
				}).getResolvedSchema().then((e) => a(e));
			}
			return this.jsonSchemaService.getSchemaForResource(e.uri, t).then((e) => a(e));
		}
		getLanguageStatus(e, t) {
			return { schemas: this.jsonSchemaService.getSchemaURIsForResource(e.uri, t) };
		}
	};
	let sl = 0;
	function ol(e) {
		if (e && "object" == typeof e) {
			if (da(e.allowComments)) return e.allowComments;
			if (e.allOf) for (const t of e.allOf) {
				const e = ol(t);
				if (da(e)) return e;
			}
		}
	}
	function al(e) {
		if (e && "object" == typeof e) {
			if (da(e.allowTrailingCommas)) return e.allowTrailingCommas;
			const t = e;
			if (da(t.allowsTrailingCommas)) return t.allowsTrailingCommas;
			if (e.allOf) for (const n of e.allOf) {
				const e = al(n);
				if (da(e)) return e;
			}
		}
	}
	function ll(e) {
		switch (e) {
			case "error": return Qs.Error;
			case "warning": return Qs.Warning;
			case "ignore": return;
		}
	}
	function ul(e) {
		return e < 48 ? 0 : e <= 57 ? e - 48 : (e < 97 && (e += 32), e >= 97 && e <= 102 ? e - 97 + 10 : 0);
	}
	function cl(e) {
		if ("#" === e[0]) switch (e.length) {
			case 4: return {
				red: 17 * ul(e.charCodeAt(1)) / 255,
				green: 17 * ul(e.charCodeAt(2)) / 255,
				blue: 17 * ul(e.charCodeAt(3)) / 255,
				alpha: 1
			};
			case 5: return {
				red: 17 * ul(e.charCodeAt(1)) / 255,
				green: 17 * ul(e.charCodeAt(2)) / 255,
				blue: 17 * ul(e.charCodeAt(3)) / 255,
				alpha: 17 * ul(e.charCodeAt(4)) / 255
			};
			case 7: return {
				red: (16 * ul(e.charCodeAt(1)) + ul(e.charCodeAt(2))) / 255,
				green: (16 * ul(e.charCodeAt(3)) + ul(e.charCodeAt(4))) / 255,
				blue: (16 * ul(e.charCodeAt(5)) + ul(e.charCodeAt(6))) / 255,
				alpha: 1
			};
			case 9: return {
				red: (16 * ul(e.charCodeAt(1)) + ul(e.charCodeAt(2))) / 255,
				green: (16 * ul(e.charCodeAt(3)) + ul(e.charCodeAt(4))) / 255,
				blue: (16 * ul(e.charCodeAt(5)) + ul(e.charCodeAt(6))) / 255,
				alpha: (16 * ul(e.charCodeAt(7)) + ul(e.charCodeAt(8))) / 255
			};
		}
	}
	var hl = class {
		constructor(e) {
			this.schemaService = e;
		}
		findDocumentSymbols(e, t, n = { resultLimit: Number.MAX_VALUE }) {
			const r = t.root;
			if (!r) return [];
			let i = n.resultLimit || Number.MAX_VALUE;
			const s = e.uri;
			if (("vscode://defaultsettings/keybindings.json" === s || ga(s.toLowerCase(), "/user/keybindings.json")) && "array" === r.type) {
				const t = [];
				for (const o of r.items) if ("object" === o.type) {
					for (const r of o.properties) if ("key" === r.keyNode.value && r.valueNode) {
						const a = Us.create(e.uri, dl(e, o));
						if (t.push({
							name: fl(r.valueNode),
							kind: Mo.Function,
							location: a
						}), i--, i <= 0) return n && n.onResultLimitExceeded && n.onResultLimitExceeded(s), t;
					}
				}
				return t;
			}
			const o = [{
				node: r,
				containerName: ""
			}];
			let a = 0, l = !1;
			const u = [], c = (t, n) => {
				"array" === t.type ? t.items.forEach((e) => {
					e && o.push({
						node: e,
						containerName: n
					});
				}) : "object" === t.type && t.properties.forEach((t) => {
					const r = t.valueNode;
					if (r) if (i > 0) {
						i--;
						const s = Us.create(e.uri, dl(e, t)), a = n ? n + "." + t.keyNode.value : t.keyNode.value;
						u.push({
							name: this.getKeyLabel(t),
							kind: this.getSymbolKind(r.type),
							location: s,
							containerName: n
						}), o.push({
							node: r,
							containerName: a
						});
					} else l = !0;
				});
			};
			for (; a < o.length;) {
				const e = o[a++];
				c(e.node, e.containerName);
			}
			return l && n && n.onResultLimitExceeded && n.onResultLimitExceeded(s), u;
		}
		findDocumentSymbols2(e, t, n = { resultLimit: Number.MAX_VALUE }) {
			const r = t.root;
			if (!r) return [];
			let i = n.resultLimit || Number.MAX_VALUE;
			const s = e.uri;
			if (("vscode://defaultsettings/keybindings.json" === s || ga(s.toLowerCase(), "/user/keybindings.json")) && "array" === r.type) {
				const t = [];
				for (const o of r.items) if ("object" === o.type) {
					for (const r of o.properties) if ("key" === r.keyNode.value && r.valueNode) {
						const a = dl(e, o), l = dl(e, r.keyNode);
						if (t.push({
							name: fl(r.valueNode),
							kind: Mo.Function,
							range: a,
							selectionRange: l
						}), i--, i <= 0) return n && n.onResultLimitExceeded && n.onResultLimitExceeded(s), t;
					}
				}
				return t;
			}
			const o = [], a = [{
				node: r,
				result: o
			}];
			let l = 0, u = !1;
			const c = (t, n) => {
				"array" === t.type ? t.items.forEach((t, r) => {
					if (t) if (i > 0) {
						i--;
						const s = dl(e, t), o = s, l = {
							name: String(r),
							kind: this.getSymbolKind(t.type),
							range: s,
							selectionRange: o,
							children: []
						};
						n.push(l), a.push({
							result: l.children,
							node: t
						});
					} else u = !0;
				}) : "object" === t.type && t.properties.forEach((t) => {
					const r = t.valueNode;
					if (r) if (i > 0) {
						i--;
						const s = dl(e, t), o = dl(e, t.keyNode), l = [], u = {
							name: this.getKeyLabel(t),
							kind: this.getSymbolKind(r.type),
							range: s,
							selectionRange: o,
							children: l,
							detail: this.getDetail(r)
						};
						n.push(u), a.push({
							result: l,
							node: r
						});
					} else u = !0;
				});
			};
			for (; l < a.length;) {
				const e = a[l++];
				c(e.node, e.result);
			}
			return u && n && n.onResultLimitExceeded && n.onResultLimitExceeded(s), o;
		}
		getSymbolKind(e) {
			switch (e) {
				case "object": return Mo.Module;
				case "string": return Mo.String;
				case "number": return Mo.Number;
				case "array": return Mo.Array;
				case "boolean": return Mo.Boolean;
				default: return Mo.Variable;
			}
		}
		getKeyLabel(e) {
			let t = e.keyNode.value;
			return t && (t = t.replace(/[\n]/g, "↵")), t && t.trim() ? t : `"${t}"`;
		}
		getDetail(e) {
			if (e) return "boolean" === e.type || "number" === e.type || "null" === e.type || "string" === e.type ? String(e.value) : "array" === e.type ? e.children.length ? void 0 : "[]" : "object" === e.type ? e.children.length ? void 0 : "{}" : void 0;
		}
		findDocumentColors(e, t, n) {
			return this.schemaService.getSchemaForResource(e.uri, t).then((r) => {
				const i = [];
				if (r) {
					let s = n && "number" == typeof n.resultLimit ? n.resultLimit : Number.MAX_VALUE;
					const o = t.getMatchingSchemas(r.schema), a = {};
					for (const t of o) if (!t.inverted && t.schema && ("color" === t.schema.format || "color-hex" === t.schema.format) && t.node && "string" === t.node.type) {
						const r = String(t.node.offset);
						if (!a[r]) {
							const o = cl(Ha(t.node));
							if (o) {
								const n = dl(e, t.node);
								i.push({
									color: o,
									range: n
								});
							}
							if (a[r] = !0, s--, s <= 0) return n && n.onResultLimitExceeded && n.onResultLimitExceeded(e.uri), i;
						}
					}
				}
				return i;
			});
		}
		getColorPresentations(e, t, n, r) {
			const i = [], s = Math.round(255 * n.red), o = Math.round(255 * n.green), a = Math.round(255 * n.blue);
			function l(e) {
				const t = e.toString(16);
				return 2 !== t.length ? "0" + t : t;
			}
			let u;
			return u = 1 === n.alpha ? `#${l(s)}${l(o)}${l(a)}` : `#${l(s)}${l(o)}${l(a)}${l(Math.round(255 * n.alpha))}`, i.push({
				label: u,
				textEdit: no.replace(r, JSON.stringify(u))
			}), i;
		}
	};
	function dl(e, t) {
		return $s.create(e.positionAt(t.offset), e.positionAt(t.offset + t.length));
	}
	function fl(e) {
		return Ha(e) || ka("<empty>");
	}
	const ml = {
		schemaAssociations: [],
		schemas: {
			"http://json-schema.org/draft-04/schema#": {
				$schema: "http://json-schema.org/draft-04/schema#",
				definitions: {
					schemaArray: {
						type: "array",
						minItems: 1,
						items: { $ref: "#" }
					},
					positiveInteger: {
						type: "integer",
						minimum: 0
					},
					positiveIntegerDefault0: { allOf: [{ $ref: "#/definitions/positiveInteger" }, { default: 0 }] },
					simpleTypes: {
						type: "string",
						enum: [
							"array",
							"boolean",
							"integer",
							"null",
							"number",
							"object",
							"string"
						]
					},
					stringArray: {
						type: "array",
						items: { type: "string" },
						minItems: 1,
						uniqueItems: !0
					}
				},
				type: "object",
				properties: {
					id: {
						type: "string",
						format: "uri"
					},
					$schema: {
						type: "string",
						format: "uri"
					},
					title: { type: "string" },
					description: { type: "string" },
					default: {},
					multipleOf: {
						type: "number",
						minimum: 0,
						exclusiveMinimum: !0
					},
					maximum: { type: "number" },
					exclusiveMaximum: {
						type: "boolean",
						default: !1
					},
					minimum: { type: "number" },
					exclusiveMinimum: {
						type: "boolean",
						default: !1
					},
					maxLength: { allOf: [{ $ref: "#/definitions/positiveInteger" }] },
					minLength: { allOf: [{ $ref: "#/definitions/positiveIntegerDefault0" }] },
					pattern: {
						type: "string",
						format: "regex"
					},
					additionalItems: {
						anyOf: [{ type: "boolean" }, { $ref: "#" }],
						default: {}
					},
					items: {
						anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
						default: {}
					},
					maxItems: { allOf: [{ $ref: "#/definitions/positiveInteger" }] },
					minItems: { allOf: [{ $ref: "#/definitions/positiveIntegerDefault0" }] },
					uniqueItems: {
						type: "boolean",
						default: !1
					},
					maxProperties: { allOf: [{ $ref: "#/definitions/positiveInteger" }] },
					minProperties: { allOf: [{ $ref: "#/definitions/positiveIntegerDefault0" }] },
					required: { allOf: [{ $ref: "#/definitions/stringArray" }] },
					additionalProperties: {
						anyOf: [{ type: "boolean" }, { $ref: "#" }],
						default: {}
					},
					definitions: {
						type: "object",
						additionalProperties: { $ref: "#" },
						default: {}
					},
					properties: {
						type: "object",
						additionalProperties: { $ref: "#" },
						default: {}
					},
					patternProperties: {
						type: "object",
						additionalProperties: { $ref: "#" },
						default: {}
					},
					dependencies: {
						type: "object",
						additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] }
					},
					enum: {
						type: "array",
						minItems: 1,
						uniqueItems: !0
					},
					type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, {
						type: "array",
						items: { $ref: "#/definitions/simpleTypes" },
						minItems: 1,
						uniqueItems: !0
					}] },
					format: { anyOf: [{
						type: "string",
						enum: [
							"date-time",
							"uri",
							"email",
							"hostname",
							"ipv4",
							"ipv6",
							"regex"
						]
					}, { type: "string" }] },
					allOf: { allOf: [{ $ref: "#/definitions/schemaArray" }] },
					anyOf: { allOf: [{ $ref: "#/definitions/schemaArray" }] },
					oneOf: { allOf: [{ $ref: "#/definitions/schemaArray" }] },
					not: { allOf: [{ $ref: "#" }] }
				},
				dependencies: {
					exclusiveMaximum: ["maximum"],
					exclusiveMinimum: ["minimum"]
				},
				default: {}
			},
			"http://json-schema.org/draft-07/schema#": {
				definitions: {
					schemaArray: {
						type: "array",
						minItems: 1,
						items: { $ref: "#" }
					},
					nonNegativeInteger: {
						type: "integer",
						minimum: 0
					},
					nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] },
					simpleTypes: { enum: [
						"array",
						"boolean",
						"integer",
						"null",
						"number",
						"object",
						"string"
					] },
					stringArray: {
						type: "array",
						items: { type: "string" },
						uniqueItems: !0,
						default: []
					}
				},
				type: ["object", "boolean"],
				properties: {
					$id: {
						type: "string",
						format: "uri-reference"
					},
					$schema: {
						type: "string",
						format: "uri"
					},
					$ref: {
						type: "string",
						format: "uri-reference"
					},
					$comment: { type: "string" },
					title: { type: "string" },
					description: { type: "string" },
					default: !0,
					readOnly: {
						type: "boolean",
						default: !1
					},
					examples: {
						type: "array",
						items: !0
					},
					multipleOf: {
						type: "number",
						exclusiveMinimum: 0
					},
					maximum: { type: "number" },
					exclusiveMaximum: { type: "number" },
					minimum: { type: "number" },
					exclusiveMinimum: { type: "number" },
					maxLength: { $ref: "#/definitions/nonNegativeInteger" },
					minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
					pattern: {
						type: "string",
						format: "regex"
					},
					additionalItems: { $ref: "#" },
					items: {
						anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
						default: !0
					},
					maxItems: { $ref: "#/definitions/nonNegativeInteger" },
					minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
					uniqueItems: {
						type: "boolean",
						default: !1
					},
					contains: { $ref: "#" },
					maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
					minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
					required: { $ref: "#/definitions/stringArray" },
					additionalProperties: { $ref: "#" },
					definitions: {
						type: "object",
						additionalProperties: { $ref: "#" },
						default: {}
					},
					properties: {
						type: "object",
						additionalProperties: { $ref: "#" },
						default: {}
					},
					patternProperties: {
						type: "object",
						additionalProperties: { $ref: "#" },
						propertyNames: { format: "regex" },
						default: {}
					},
					dependencies: {
						type: "object",
						additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] }
					},
					propertyNames: { $ref: "#" },
					const: !0,
					enum: {
						type: "array",
						items: !0,
						minItems: 1,
						uniqueItems: !0
					},
					type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, {
						type: "array",
						items: { $ref: "#/definitions/simpleTypes" },
						minItems: 1,
						uniqueItems: !0
					}] },
					format: { type: "string" },
					contentMediaType: { type: "string" },
					contentEncoding: { type: "string" },
					if: { $ref: "#" },
					then: { $ref: "#" },
					else: { $ref: "#" },
					allOf: { $ref: "#/definitions/schemaArray" },
					anyOf: { $ref: "#/definitions/schemaArray" },
					oneOf: { $ref: "#/definitions/schemaArray" },
					not: { $ref: "#" }
				},
				default: !0
			}
		}
	}, gl = {
		id: ka("A unique identifier for the schema."),
		$schema: ka("The schema to verify this document against."),
		title: ka("A descriptive title of the element."),
		description: ka("A long description of the element. Used in hover menus and suggestions."),
		default: ka("A default value. Used by suggestions."),
		multipleOf: ka("A number that should cleanly divide the current value (i.e. have no remainder)."),
		maximum: ka("The maximum numerical value, inclusive by default."),
		exclusiveMaximum: ka("Makes the maximum property exclusive."),
		minimum: ka("The minimum numerical value, inclusive by default."),
		exclusiveMinimum: ka("Makes the minimum property exclusive."),
		maxLength: ka("The maximum length of a string."),
		minLength: ka("The minimum length of a string."),
		pattern: ka("A regular expression to match the string against. It is not implicitly anchored."),
		additionalItems: ka("For arrays, only when items is set as an array. If it is a schema, then this schema validates items after the ones specified by the items array. If it is false, then additional items will cause validation to fail."),
		items: ka("For arrays. Can either be a schema to validate every element against or an array of schemas to validate each item against in order (the first schema will validate the first element, the second schema will validate the second element, and so on."),
		maxItems: ka("The maximum number of items that can be inside an array. Inclusive."),
		minItems: ka("The minimum number of items that can be inside an array. Inclusive."),
		uniqueItems: ka("If all of the items in the array must be unique. Defaults to false."),
		maxProperties: ka("The maximum number of properties an object can have. Inclusive."),
		minProperties: ka("The minimum number of properties an object can have. Inclusive."),
		required: ka("An array of strings that lists the names of all properties required on this object."),
		additionalProperties: ka("Either a schema or a boolean. If a schema, then used to validate all properties not matched by 'properties' or 'patternProperties'. If false, then any properties not matched by either will cause this schema to fail."),
		definitions: ka("Not used for validation. Place subschemas here that you wish to reference inline with $ref."),
		properties: ka("A map of property names to schemas for each property."),
		patternProperties: ka("A map of regular expressions on property names to schemas for matching properties."),
		dependencies: ka("A map of property names to either an array of property names or a schema. An array of property names means the property named in the key depends on the properties in the array being present in the object in order to be valid. If the value is a schema, then the schema is only applied to the object if the property in the key exists on the object."),
		enum: ka("The set of literal values that are valid."),
		type: ka("Either a string of one of the basic schema types (number, integer, null, array, object, boolean, string) or an array of strings specifying a subset of those types."),
		format: ka("Describes the format expected for the value."),
		allOf: ka("An array of schemas, all of which must match."),
		anyOf: ka("An array of schemas, where at least one must match."),
		oneOf: ka("An array of schemas, exactly one of which must match."),
		not: ka("A schema which must not match."),
		$id: ka("A unique identifier for the schema."),
		$ref: ka("Reference a definition hosted on any location."),
		$comment: ka("Comments from schema authors to readers or maintainers of the schema."),
		readOnly: ka("Indicates that the value of the instance is managed exclusively by the owning authority."),
		examples: ka("Sample JSON values associated with a particular schema, for the purpose of illustrating usage."),
		contains: ka("An array instance is valid against \"contains\" if at least one of its elements is valid against the given schema."),
		propertyNames: ka("If the instance is an object, this keyword validates if every property name in the instance validates against the provided schema."),
		const: ka("An instance validates successfully against this keyword if its value is equal to the value of the keyword."),
		contentMediaType: ka("Describes the media type of a string property."),
		contentEncoding: ka("Describes the content encoding of a string property."),
		if: ka("The validation outcome of the \"if\" subschema controls which of the \"then\" or \"else\" keywords are evaluated."),
		then: ka("The \"if\" subschema is used for validation when the \"if\" subschema succeeds."),
		else: ka("The \"else\" subschema is used for validation when the \"if\" subschema fails.")
	};
	for (const Xl in ml.schemas) {
		const e = ml.schemas[Xl];
		for (const t in e.properties) {
			let n = e.properties[t];
			"boolean" == typeof n && (n = e.properties[t] = {});
			const r = gl[t];
			r && (n.description = r);
		}
	}
	var pl;
	(() => {
		var e = { 470: (e) => {
			function t(e) {
				if ("string" != typeof e) throw new TypeError("Path must be a string. Received " + JSON.stringify(e));
			}
			function n(e, t) {
				for (var n, r = "", i = 0, s = -1, o = 0, a = 0; a <= e.length; ++a) {
					if (a < e.length) n = e.charCodeAt(a);
					else {
						if (47 === n) break;
						n = 47;
					}
					if (47 === n) {
						if (s === a - 1 || 1 === o);
						else if (s !== a - 1 && 2 === o) {
							if (r.length < 2 || 2 !== i || 46 !== r.charCodeAt(r.length - 1) || 46 !== r.charCodeAt(r.length - 2)) {
								if (r.length > 2) {
									var l = r.lastIndexOf("/");
									if (l !== r.length - 1) {
										-1 === l ? (r = "", i = 0) : i = (r = r.slice(0, l)).length - 1 - r.lastIndexOf("/"), s = a, o = 0;
										continue;
									}
								} else if (2 === r.length || 1 === r.length) {
									r = "", i = 0, s = a, o = 0;
									continue;
								}
							}
							t && (r.length > 0 ? r += "/.." : r = "..", i = 2);
						} else r.length > 0 ? r += "/" + e.slice(s + 1, a) : r = e.slice(s + 1, a), i = a - s - 1;
						s = a, o = 0;
					} else 46 === n && -1 !== o ? ++o : o = -1;
				}
				return r;
			}
			var r = {
				resolve: function() {
					for (var e, r = "", i = !1, s = arguments.length - 1; s >= -1 && !i; s--) {
						var o;
						s >= 0 ? o = arguments[s] : (void 0 === e && (e = process.cwd()), o = e), t(o), 0 !== o.length && (r = o + "/" + r, i = 47 === o.charCodeAt(0));
					}
					return r = n(r, !i), i ? r.length > 0 ? "/" + r : "/" : r.length > 0 ? r : ".";
				},
				normalize: function(e) {
					if (t(e), 0 === e.length) return ".";
					var r = 47 === e.charCodeAt(0), i = 47 === e.charCodeAt(e.length - 1);
					return 0 !== (e = n(e, !r)).length || r || (e = "."), e.length > 0 && i && (e += "/"), r ? "/" + e : e;
				},
				isAbsolute: function(e) {
					return t(e), e.length > 0 && 47 === e.charCodeAt(0);
				},
				join: function() {
					if (0 === arguments.length) return ".";
					for (var e, n = 0; n < arguments.length; ++n) {
						var i = arguments[n];
						t(i), i.length > 0 && (void 0 === e ? e = i : e += "/" + i);
					}
					return void 0 === e ? "." : r.normalize(e);
				},
				relative: function(e, n) {
					if (t(e), t(n), e === n) return "";
					if ((e = r.resolve(e)) === (n = r.resolve(n))) return "";
					for (var i = 1; i < e.length && 47 === e.charCodeAt(i); ++i);
					for (var s = e.length, o = s - i, a = 1; a < n.length && 47 === n.charCodeAt(a); ++a);
					for (var l = n.length - a, u = o < l ? o : l, c = -1, h = 0; h <= u; ++h) {
						if (h === u) {
							if (l > u) {
								if (47 === n.charCodeAt(a + h)) return n.slice(a + h + 1);
								if (0 === h) return n.slice(a + h);
							} else o > u && (47 === e.charCodeAt(i + h) ? c = h : 0 === h && (c = 0));
							break;
						}
						var d = e.charCodeAt(i + h);
						if (d !== n.charCodeAt(a + h)) break;
						47 === d && (c = h);
					}
					var f = "";
					for (h = i + c + 1; h <= s; ++h) h !== s && 47 !== e.charCodeAt(h) || (0 === f.length ? f += ".." : f += "/..");
					return f.length > 0 ? f + n.slice(a + c) : (a += c, 47 === n.charCodeAt(a) && ++a, n.slice(a));
				},
				_makeLong: function(e) {
					return e;
				},
				dirname: function(e) {
					if (t(e), 0 === e.length) return ".";
					for (var n = e.charCodeAt(0), r = 47 === n, i = -1, s = !0, o = e.length - 1; o >= 1; --o) if (47 === (n = e.charCodeAt(o))) {
						if (!s) {
							i = o;
							break;
						}
					} else s = !1;
					return -1 === i ? r ? "/" : "." : r && 1 === i ? "//" : e.slice(0, i);
				},
				basename: function(e, n) {
					if (void 0 !== n && "string" != typeof n) throw new TypeError("\"ext\" argument must be a string");
					t(e);
					var r, i = 0, s = -1, o = !0;
					if (void 0 !== n && n.length > 0 && n.length <= e.length) {
						if (n.length === e.length && n === e) return "";
						var a = n.length - 1, l = -1;
						for (r = e.length - 1; r >= 0; --r) {
							var u = e.charCodeAt(r);
							if (47 === u) {
								if (!o) {
									i = r + 1;
									break;
								}
							} else -1 === l && (o = !1, l = r + 1), a >= 0 && (u === n.charCodeAt(a) ? -1 == --a && (s = r) : (a = -1, s = l));
						}
						return i === s ? s = l : -1 === s && (s = e.length), e.slice(i, s);
					}
					for (r = e.length - 1; r >= 0; --r) if (47 === e.charCodeAt(r)) {
						if (!o) {
							i = r + 1;
							break;
						}
					} else -1 === s && (o = !1, s = r + 1);
					return -1 === s ? "" : e.slice(i, s);
				},
				extname: function(e) {
					t(e);
					for (var n = -1, r = 0, i = -1, s = !0, o = 0, a = e.length - 1; a >= 0; --a) {
						var l = e.charCodeAt(a);
						if (47 !== l) -1 === i && (s = !1, i = a + 1), 46 === l ? -1 === n ? n = a : 1 !== o && (o = 1) : -1 !== n && (o = -1);
						else if (!s) {
							r = a + 1;
							break;
						}
					}
					return -1 === n || -1 === i || 0 === o || 1 === o && n === i - 1 && n === r + 1 ? "" : e.slice(n, i);
				},
				format: function(e) {
					if (null === e || "object" != typeof e) throw new TypeError("The \"pathObject\" argument must be of type Object. Received type " + typeof e);
					return function(e, t) {
						var n = t.dir || t.root, r = t.base || (t.name || "") + (t.ext || "");
						return n ? n === t.root ? n + r : n + "/" + r : r;
					}(0, e);
				},
				parse: function(e) {
					t(e);
					var n = {
						root: "",
						dir: "",
						base: "",
						ext: "",
						name: ""
					};
					if (0 === e.length) return n;
					var r, i = e.charCodeAt(0), s = 47 === i;
					s ? (n.root = "/", r = 1) : r = 0;
					for (var o = -1, a = 0, l = -1, u = !0, c = e.length - 1, h = 0; c >= r; --c) if (47 !== (i = e.charCodeAt(c))) -1 === l && (u = !1, l = c + 1), 46 === i ? -1 === o ? o = c : 1 !== h && (h = 1) : -1 !== o && (h = -1);
					else if (!u) {
						a = c + 1;
						break;
					}
					return -1 === o || -1 === l || 0 === h || 1 === h && o === l - 1 && o === a + 1 ? -1 !== l && (n.base = n.name = 0 === a && s ? e.slice(1, l) : e.slice(a, l)) : (0 === a && s ? (n.name = e.slice(1, o), n.base = e.slice(1, l)) : (n.name = e.slice(a, o), n.base = e.slice(a, l)), n.ext = e.slice(o, l)), a > 0 ? n.dir = e.slice(0, a - 1) : s && (n.dir = "/"), n;
				},
				sep: "/",
				delimiter: ":",
				win32: null,
				posix: null
			};
			r.posix = r, e.exports = r;
		} }, t = {};
		function n(r) {
			var i = t[r];
			if (void 0 !== i) return i.exports;
			var s = t[r] = { exports: {} };
			return e[r](s, s.exports, n), s.exports;
		}
		n.d = (e, t) => {
			for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
				enumerable: !0,
				get: t[r]
			});
		}, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = (e) => {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
		};
		var r = {};
		(() => {
			let e;
			n.r(r), n.d(r, {
				URI: () => c,
				Utils: () => L
			}), "object" == typeof process ? e = "win32" === process.platform : "object" == typeof navigator && (e = navigator.userAgent.indexOf("Windows") >= 0);
			const t = /^\w[\w\d+.-]*$/, i = /^\//, s = /^\/\//;
			function o(e, n) {
				if (!e.scheme && n) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);
				if (e.scheme && !t.test(e.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
				if (e.path) {
					if (e.authority) {
						if (!i.test(e.path)) throw new Error("[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash (\"/\") character");
					} else if (s.test(e.path)) throw new Error("[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters (\"//\")");
				}
			}
			const a = "", l = "/", u = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
			class c {
				static isUri(e) {
					return e instanceof c || !!e && "string" == typeof e.authority && "string" == typeof e.fragment && "string" == typeof e.path && "string" == typeof e.query && "string" == typeof e.scheme && "string" == typeof e.fsPath && "function" == typeof e.with && "function" == typeof e.toString;
				}
				scheme;
				authority;
				path;
				query;
				fragment;
				constructor(e, t, n, r, i, s = !1) {
					"object" == typeof e ? (this.scheme = e.scheme || a, this.authority = e.authority || a, this.path = e.path || a, this.query = e.query || a, this.fragment = e.fragment || a) : (this.scheme = function(e, t) {
						return e || t ? e : "file";
					}(e, s), this.authority = t || a, this.path = function(e, t) {
						switch (e) {
							case "https":
							case "http":
							case "file": t ? t[0] !== l && (t = l + t) : t = l;
						}
						return t;
					}(this.scheme, n || a), this.query = r || a, this.fragment = i || a, o(this, s));
				}
				get fsPath() {
					return p(this);
				}
				with(e) {
					if (!e) return this;
					let { scheme: t, authority: n, path: r, query: i, fragment: s } = e;
					return void 0 === t ? t = this.scheme : null === t && (t = a), void 0 === n ? n = this.authority : null === n && (n = a), void 0 === r ? r = this.path : null === r && (r = a), void 0 === i ? i = this.query : null === i && (i = a), void 0 === s ? s = this.fragment : null === s && (s = a), t === this.scheme && n === this.authority && r === this.path && i === this.query && s === this.fragment ? this : new d(t, n, r, i, s);
				}
				static parse(e, t = !1) {
					const n = u.exec(e);
					return n ? new d(n[2] || a, w(n[4] || a), w(n[5] || a), w(n[7] || a), w(n[9] || a), t) : new d(a, a, a, a, a);
				}
				static file(t) {
					let n = a;
					if (e && (t = t.replace(/\\/g, l)), t[0] === l && t[1] === l) {
						const e = t.indexOf(l, 2);
						-1 === e ? (n = t.substring(2), t = l) : (n = t.substring(2, e), t = t.substring(e) || l);
					}
					return new d("file", n, t, a, a);
				}
				static from(e) {
					const t = new d(e.scheme, e.authority, e.path, e.query, e.fragment);
					return o(t, !0), t;
				}
				toString(e = !1) {
					return b(this, e);
				}
				toJSON() {
					return this;
				}
				static revive(e) {
					if (e) {
						if (e instanceof c) return e;
						{
							const t = new d(e);
							return t._formatted = e.external, t._fsPath = e._sep === h ? e.fsPath : null, t;
						}
					}
					return e;
				}
			}
			const h = e ? 1 : void 0;
			class d extends c {
				_formatted = null;
				_fsPath = null;
				get fsPath() {
					return this._fsPath || (this._fsPath = p(this)), this._fsPath;
				}
				toString(e = !1) {
					return e ? b(this, !0) : (this._formatted || (this._formatted = b(this, !1)), this._formatted);
				}
				toJSON() {
					const e = { $mid: 1 };
					return this._fsPath && (e.fsPath = this._fsPath, e._sep = h), this._formatted && (e.external = this._formatted), this.path && (e.path = this.path), this.scheme && (e.scheme = this.scheme), this.authority && (e.authority = this.authority), this.query && (e.query = this.query), this.fragment && (e.fragment = this.fragment), e;
				}
			}
			const f = {
				58: "%3A",
				47: "%2F",
				63: "%3F",
				35: "%23",
				91: "%5B",
				93: "%5D",
				64: "%40",
				33: "%21",
				36: "%24",
				38: "%26",
				39: "%27",
				40: "%28",
				41: "%29",
				42: "%2A",
				43: "%2B",
				44: "%2C",
				59: "%3B",
				61: "%3D",
				32: "%20"
			};
			function m(e, t, n) {
				let r, i = -1;
				for (let s = 0; s < e.length; s++) {
					const o = e.charCodeAt(s);
					if (o >= 97 && o <= 122 || o >= 65 && o <= 90 || o >= 48 && o <= 57 || 45 === o || 46 === o || 95 === o || 126 === o || t && 47 === o || n && 91 === o || n && 93 === o || n && 58 === o) -1 !== i && (r += encodeURIComponent(e.substring(i, s)), i = -1), void 0 !== r && (r += e.charAt(s));
					else {
						void 0 === r && (r = e.substr(0, s));
						const t = f[o];
						void 0 !== t ? (-1 !== i && (r += encodeURIComponent(e.substring(i, s)), i = -1), r += t) : -1 === i && (i = s);
					}
				}
				return -1 !== i && (r += encodeURIComponent(e.substring(i))), void 0 !== r ? r : e;
			}
			function g(e) {
				let t;
				for (let n = 0; n < e.length; n++) {
					const r = e.charCodeAt(n);
					35 === r || 63 === r ? (void 0 === t && (t = e.substr(0, n)), t += f[r]) : void 0 !== t && (t += e[n]);
				}
				return void 0 !== t ? t : e;
			}
			function p(t, n) {
				let r;
				return r = t.authority && t.path.length > 1 && "file" === t.scheme ? `//${t.authority}${t.path}` : 47 === t.path.charCodeAt(0) && (t.path.charCodeAt(1) >= 65 && t.path.charCodeAt(1) <= 90 || t.path.charCodeAt(1) >= 97 && t.path.charCodeAt(1) <= 122) && 58 === t.path.charCodeAt(2) ? t.path[1].toLowerCase() + t.path.substr(2) : t.path, e && (r = r.replace(/\//g, "\\")), r;
			}
			function b(e, t) {
				const n = t ? g : m;
				let r = "", { scheme: i, authority: s, path: o, query: a, fragment: u } = e;
				if (i && (r += i, r += ":"), (s || "file" === i) && (r += l, r += l), s) {
					let e = s.indexOf("@");
					if (-1 !== e) {
						const t = s.substr(0, e);
						s = s.substr(e + 1), e = t.lastIndexOf(":"), -1 === e ? r += n(t, !1, !1) : (r += n(t.substr(0, e), !1, !1), r += ":", r += n(t.substr(e + 1), !1, !0)), r += "@";
					}
					s = s.toLowerCase(), e = s.lastIndexOf(":"), -1 === e ? r += n(s, !1, !0) : (r += n(s.substr(0, e), !1, !0), r += s.substr(e));
				}
				if (o) {
					if (o.length >= 3 && 47 === o.charCodeAt(0) && 58 === o.charCodeAt(2)) {
						const e = o.charCodeAt(1);
						e >= 65 && e <= 90 && (o = `/${String.fromCharCode(e + 32)}:${o.substr(3)}`);
					} else if (o.length >= 2 && 58 === o.charCodeAt(1)) {
						const e = o.charCodeAt(0);
						e >= 65 && e <= 90 && (o = `${String.fromCharCode(e + 32)}:${o.substr(2)}`);
					}
					r += n(o, !0, !1);
				}
				return a && (r += "?", r += n(a, !1, !1)), u && (r += "#", r += t ? u : m(u, !1, !1)), r;
			}
			function y(e) {
				try {
					return decodeURIComponent(e);
				} catch {
					return e.length > 3 ? e.substr(0, 3) + y(e.substr(3)) : e;
				}
			}
			const v = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
			function w(e) {
				return e.match(v) ? e.replace(v, (e) => y(e)) : e;
			}
			var _ = n(470);
			const C = _.posix || _, S = "/";
			var L;
			(function(e) {
				e.joinPath = function(e, ...t) {
					return e.with({ path: C.join(e.path, ...t) });
				}, e.resolvePath = function(e, ...t) {
					let n = e.path, r = !1;
					n[0] !== S && (n = S + n, r = !0);
					let i = C.resolve(n, ...t);
					return r && i[0] === S && !e.authority && (i = i.substring(1)), e.with({ path: i });
				}, e.dirname = function(e) {
					if (0 === e.path.length || e.path === S) return e;
					let t = C.dirname(e.path);
					return 1 === t.length && 46 === t.charCodeAt(0) && (t = ""), e.with({ path: t });
				}, e.basename = function(e) {
					return C.basename(e.path);
				}, e.extname = function(e) {
					return C.extname(e.path);
				};
			})(L || (L = {}));
		})(), pl = r;
	})();
	const { URI: bl, Utils: yl } = pl;
	function vl(e, t) {
		if ("string" != typeof e) throw new TypeError("Expected a string");
		const n = String(e);
		let r = "";
		const i = !!t, s = !!t;
		let o = !1;
		const a = t && "string" == typeof t.flags ? t.flags : "";
		let l;
		for (let u = 0, c = n.length; u < c; u++) switch (l = n[u], l) {
			case "/":
			case "$":
			case "^":
			case "+":
			case ".":
			case "(":
			case ")":
			case "=":
			case "!":
			case "|":
				r += "\\" + l;
				break;
			case "?": if (i) {
				r += ".";
				break;
			}
			case "[":
			case "]": if (i) {
				r += l;
				break;
			}
			case "{": if (i) {
				o = !0, r += "(";
				break;
			}
			case "}": if (i) {
				o = !1, r += ")";
				break;
			}
			case ",":
				if (o) {
					r += "|";
					break;
				}
				r += "\\" + l;
				break;
			case "*":
				const e = n[u - 1];
				let t = 1;
				for (; "*" === n[u + 1];) t++, u++;
				const a = n[u + 1];
				s ? !(t > 1) || "/" !== e && void 0 !== e && "{" !== e && "," !== e || "/" !== a && void 0 !== a && "," !== a && "}" !== a ? r += "([^/]*)" : ("/" === a ? u++ : "/" === e && r.endsWith("\\/") && (r = r.substr(0, r.length - 2)), r += "((?:[^/]*(?:/|$))*)") : r += ".*";
				break;
			default: r += l;
		}
		return a && ~a.indexOf("g") || (r = "^" + r + "$"), new RegExp(r, a);
	}
	var wl = class {
		constructor(e, t, n) {
			this.folderUri = t, this.uris = n, this.globWrappers = [];
			try {
				for (let t of e) {
					const e = "!" !== t[0];
					e || (t = t.substring(1)), t.length > 0 && ("/" === t[0] && (t = t.substring(1)), this.globWrappers.push({
						regexp: vl("**/" + t, {
							extended: !0,
							globstar: !0
						}),
						include: e
					}));
				}
				t && ((t = El(t)).endsWith("/") || (t += "/"), this.folderUri = t);
			} catch (Jl) {
				this.globWrappers.length = 0, this.uris = [];
			}
		}
		matchesPattern(e) {
			if (this.folderUri && !e.startsWith(this.folderUri)) return !1;
			let t = !1;
			for (const { regexp: n, include: r } of this.globWrappers) n.test(e) && (t = r);
			return t;
		}
		getURIs() {
			return this.uris;
		}
	}, _l = class {
		constructor(e, t, n) {
			this.service = e, this.uri = t, this.dependencies = /* @__PURE__ */ new Set(), this.anchors = void 0, n && (this.unresolvedSchema = this.service.promise.resolve(new Cl(n)));
		}
		getUnresolvedSchema() {
			return this.unresolvedSchema || (this.unresolvedSchema = this.service.loadSchema(this.uri)), this.unresolvedSchema;
		}
		getResolvedSchema() {
			return this.resolvedSchema || (this.resolvedSchema = this.getUnresolvedSchema().then((e) => this.service.resolveSchemaContent(e, this))), this.resolvedSchema;
		}
		clearSchema() {
			const e = !!this.unresolvedSchema;
			return this.resolvedSchema = void 0, this.unresolvedSchema = void 0, this.dependencies.clear(), this.anchors = void 0, e;
		}
	}, Cl = class {
		constructor(e, t = []) {
			this.schema = e, this.errors = t;
		}
	}, Sl = class {
		constructor(e, t = [], n = [], r) {
			this.schema = e, this.errors = t, this.warnings = n, this.schemaDraft = r;
		}
		getSection(e) {
			const t = this.getSectionRecursive(e, this.schema);
			if (t) return Ba(t);
		}
		getSectionRecursive(e, t) {
			if (!t || "boolean" == typeof t || 0 === e.length) return t;
			const n = e.shift();
			if (t.properties && (t.properties[n], 1)) return this.getSectionRecursive(e, t.properties[n]);
			if (t.patternProperties) {
				for (const r of Object.keys(t.patternProperties)) if (pa(r)?.test(n)) return this.getSectionRecursive(e, t.patternProperties[r]);
			} else {
				if ("object" == typeof t.additionalProperties) return this.getSectionRecursive(e, t.additionalProperties);
				if (n.match("[0-9]+")) {
					if (Array.isArray(t.items)) {
						const r = parseInt(n, 10);
						if (!isNaN(r) && t.items[r]) return this.getSectionRecursive(e, t.items[r]);
					} else if (t.items) return this.getSectionRecursive(e, t.items);
				}
			}
		}
	}, Ll = class {
		constructor(e, t, n) {
			this.contextService = t, this.requestService = e, this.promiseConstructor = n || Promise, this.callOnDispose = [], this.contributionSchemas = {}, this.contributionAssociations = [], this.schemasById = {}, this.filePatternAssociations = [], this.registeredSchemasIds = {};
		}
		getRegisteredSchemaIds(e) {
			return Object.keys(this.registeredSchemasIds).filter((t) => {
				const n = bl.parse(t).scheme;
				return "schemaservice" !== n && (!e || e(n));
			});
		}
		get promise() {
			return this.promiseConstructor;
		}
		dispose() {
			for (; this.callOnDispose.length > 0;) this.callOnDispose.pop()();
		}
		onResourceChange(e) {
			this.cachedSchemaForResource = void 0;
			let t = !1;
			const n = [e = xl(e)], r = Object.keys(this.schemasById).map((e) => this.schemasById[e]);
			for (; n.length;) {
				const e = n.pop();
				for (let i = 0; i < r.length; i++) {
					const s = r[i];
					s && (s.uri === e || s.dependencies.has(e)) && (s.uri !== e && n.push(s.uri), s.clearSchema() && (t = !0), r[i] = void 0);
				}
			}
			return t;
		}
		setSchemaContributions(e) {
			if (e.schemas) {
				const t = e.schemas;
				for (const e in t) {
					const n = xl(e);
					this.contributionSchemas[n] = this.addSchemaHandle(n, t[e]);
				}
			}
			if (Array.isArray(e.schemaAssociations)) {
				const t = e.schemaAssociations;
				for (let e of t) {
					const t = e.uris.map(xl), n = this.addFilePatternAssociation(e.pattern, e.folderUri, t);
					this.contributionAssociations.push(n);
				}
			}
		}
		addSchemaHandle(e, t) {
			const n = new _l(this, e, t);
			return this.schemasById[e] = n, n;
		}
		getOrAddSchemaHandle(e, t) {
			return this.schemasById[e] || this.addSchemaHandle(e, t);
		}
		addFilePatternAssociation(e, t, n) {
			const r = new wl(e, t, n);
			return this.filePatternAssociations.push(r), r;
		}
		registerExternalSchema(e) {
			const t = xl(e.uri);
			return this.registeredSchemasIds[t] = !0, this.cachedSchemaForResource = void 0, e.fileMatch && e.fileMatch.length && this.addFilePatternAssociation(e.fileMatch, e.folderUri, [t]), e.schema ? this.addSchemaHandle(t, e.schema) : this.getOrAddSchemaHandle(t);
		}
		clearExternalSchemas() {
			this.schemasById = {}, this.filePatternAssociations = [], this.registeredSchemasIds = {}, this.cachedSchemaForResource = void 0;
			for (const e in this.contributionSchemas) this.schemasById[e] = this.contributionSchemas[e], this.registeredSchemasIds[e] = !0;
			for (const e of this.contributionAssociations) this.filePatternAssociations.push(e);
		}
		getResolvedSchema(e) {
			const t = xl(e), n = this.schemasById[t];
			return n ? n.getResolvedSchema() : this.promise.resolve(void 0);
		}
		loadSchema(e) {
			if (!this.requestService) {
				const t = ka("Unable to load schema from '{0}'. No schema request service available", Al(e));
				return this.promise.resolve(new Cl({}, [t]));
			}
			return e.startsWith("http://json-schema.org/") && (e = "https" + e.substring(4)), this.requestService(e).then((t) => {
				if (!t) return new Cl({}, [ka("Unable to load schema from '{0}': No content.", Al(e))]);
				const n = [];
				65279 === t.charCodeAt(0) && (n.push(ka("Problem reading content from '{0}': UTF-8 with BOM detected, only UTF 8 is allowed.", Al(e))), t = t.trimStart());
				let r = {};
				const i = [];
				return r = Ms(t, i), i.length && n.push(ka("Unable to parse content from '{0}': Parse error at offset {1}.", Al(e), i[0].offset)), new Cl(r, n);
			}, (t) => {
				let n = t.toString();
				const r = t.toString().split("Error: ");
				return r.length > 1 && (n = r[1]), ga(n, ".") && (n = n.substr(0, n.length - 1)), new Cl({}, [ka("Unable to load schema from '{0}': {1}.", Al(e), n)]);
			});
		}
		resolveSchemaContent(e, t) {
			const n = e.errors.slice(0), r = e.schema;
			let i = r.$schema ? xl(r.$schema) : void 0;
			if ("http://json-schema.org/draft-03/schema" === i) return this.promise.resolve(new Sl({}, [ka("Draft-03 schemas are not supported.")], [], i));
			let s = /* @__PURE__ */ new Set();
			const o = this.contextService, a = (e, t, r, i) => {
				let s;
				s = void 0 === i || 0 === i.length ? t : "/" === i.charAt(0) ? ((e, t) => {
					t = decodeURIComponent(t);
					let n = e;
					return "/" === t[0] && (t = t.substring(1)), t.split("/").some((e) => (e = e.replace(/~1/g, "/").replace(/~0/g, "~"), n = n[e], !n)), n;
				})(t, i) : ((e, t, n) => (t.anchors || (t.anchors = c(e)), t.anchors.get(n)))(t, r, i), s ? ((e, t) => {
					for (const n in t) t.hasOwnProperty(n) && "id" !== n && "$id" !== n && (e[n] = t[n]);
				})(e, s) : n.push(ka("$ref '{0}' in '{1}' can not be resolved.", i || "", r.uri));
			}, l = (e, t, r, i) => {
				o && !/^[A-Za-z][A-Za-z0-9+\-.+]*:\/\/.*/.test(t) && (t = o.resolveRelativePath(t, i.uri)), t = xl(t);
				const s = this.getOrAddSchemaHandle(t);
				return s.getUnresolvedSchema().then((o) => {
					if (i.dependencies.add(t), o.errors.length) {
						const e = r ? t + "#" + r : t;
						n.push(ka("Problems loading reference '{0}': {1}", e, o.errors[0]));
					}
					return a(e, o.schema, s, r), u(e, o.schema, s);
				});
			}, u = (e, t, n) => {
				const r = [];
				return this.traverseNodes(e, (e) => {
					const i = /* @__PURE__ */ new Set();
					for (; e.$ref;) {
						const s = e.$ref, o = s.split("#", 2);
						if (delete e.$ref, o[0].length > 0) return void r.push(l(e, o[0], o[1], n));
						if (!i.has(s)) {
							const r = o[1];
							a(e, t, n, r), i.add(s);
						}
					}
					e.$recursiveRef && s.add("$recursiveRef"), e.$dynamicRef && s.add("$dynamicRef");
				}), this.promise.all(r);
			}, c = (e) => {
				const t = /* @__PURE__ */ new Map();
				return this.traverseNodes(e, (e) => {
					const r = e.$id || e.id, i = fa(r) && "#" === r.charAt(0) ? r.substring(1) : e.$anchor;
					i && (t.has(i) ? n.push(ka("Duplicate anchor declaration: '{0}'", i)) : t.set(i, e)), e.$recursiveAnchor && s.add("$recursiveAnchor"), e.$dynamicAnchor && s.add("$dynamicAnchor");
				}), t;
			};
			return u(r, r, t).then((e) => {
				let t = [];
				return s.size && t.push(ka("The schema uses meta-schema features ({0}) that are not yet supported by the validator.", Array.from(s.keys()).join(", "))), new Sl(r, n, t, i);
			});
		}
		traverseNodes(e, t) {
			if (!e || "object" != typeof e) return Promise.resolve(null);
			const n = /* @__PURE__ */ new Set(), r = (...e) => {
				for (const t of e) ma(t) && a.push(t);
			}, i = (...e) => {
				for (const t of e) if (ma(t)) for (const e in t) {
					const n = t[e];
					ma(n) && a.push(n);
				}
			}, s = (...e) => {
				for (const t of e) if (Array.isArray(t)) for (const e of t) ma(e) && a.push(e);
			}, o = (e) => {
				if (Array.isArray(e)) for (const t of e) ma(t) && a.push(t);
				else ma(e) && a.push(e);
			}, a = [e];
			let l = a.pop();
			for (; l;) n.has(l) || (n.add(l), t(l), r(l.additionalItems, l.additionalProperties, l.not, l.contains, l.propertyNames, l.if, l.then, l.else, l.unevaluatedItems, l.unevaluatedProperties), i(l.definitions, l.$defs, l.properties, l.patternProperties, l.dependencies, l.dependentSchemas), s(l.anyOf, l.allOf, l.oneOf, l.prefixItems), o(l.items)), l = a.pop();
		}
		getSchemaFromProperty(e, t) {
			if ("object" === t.root?.type) {
				for (const n of t.root.properties) if ("$schema" === n.keyNode.value && "string" === n.valueNode?.type) {
					let t = n.valueNode.value;
					return this.contextService && !/^\w[\w\d+.-]*:/.test(t) && (t = this.contextService.resolveRelativePath(t, e)), t;
				}
			}
		}
		getAssociatedSchemas(e) {
			const t = Object.create(null), n = [], r = El(e);
			for (const i of this.filePatternAssociations) if (i.matchesPattern(r)) for (const e of i.getURIs()) t[e] || (n.push(e), t[e] = !0);
			return n;
		}
		getSchemaURIsForResource(e, t) {
			let n = t && this.getSchemaFromProperty(e, t);
			return n ? [n] : this.getAssociatedSchemas(e);
		}
		getSchemaForResource(e, t) {
			if (t) {
				let n = this.getSchemaFromProperty(e, t);
				if (n) {
					const e = xl(n);
					return this.getOrAddSchemaHandle(e).getResolvedSchema();
				}
			}
			if (this.cachedSchemaForResource && this.cachedSchemaForResource.resource === e) return this.cachedSchemaForResource.resolvedSchema;
			const n = this.getAssociatedSchemas(e), r = n.length > 0 ? this.createCombinedSchema(e, n).getResolvedSchema() : this.promise.resolve(void 0);
			return this.cachedSchemaForResource = {
				resource: e,
				resolvedSchema: r
			}, r;
		}
		createCombinedSchema(e, t) {
			if (1 === t.length) return this.getOrAddSchemaHandle(t[0]);
			{
				const n = "schemaservice://combinedSchema/" + encodeURIComponent(e), r = { allOf: t.map((e) => ({ $ref: e })) };
				return this.addSchemaHandle(n, r);
			}
		}
		getMatchingSchemas(e, t, n) {
			if (n) {
				const e = n.id || "schemaservice://untitled/matchingSchemas/" + Nl++;
				return this.addSchemaHandle(e, n).getResolvedSchema().then((e) => t.getMatchingSchemas(e.schema).filter((e) => !e.inverted));
			}
			return this.getSchemaForResource(e.uri, t).then((e) => e ? t.getMatchingSchemas(e.schema).filter((e) => !e.inverted) : []);
		}
	};
	let Nl = 0;
	function xl(e) {
		try {
			return bl.parse(e).toString(!0);
		} catch (Jl) {
			return e;
		}
	}
	function El(e) {
		try {
			return bl.parse(e).with({
				fragment: null,
				query: null
			}).toString(!0);
		} catch (Jl) {
			return e;
		}
	}
	function Al(e) {
		try {
			const t = bl.parse(e);
			if ("file" === t.scheme) return t.fsPath;
		} catch (Jl) {}
		return e;
	}
	function kl(e, t) {
		const n = [], r = [], i = [];
		let s = -1;
		const o = ks(e.getText(), !1);
		let a = o.scan();
		function l(e) {
			n.push(e), r.push(i.length);
		}
		for (; 17 !== a;) {
			switch (a) {
				case 1:
				case 3: {
					const t = e.positionAt(o.getTokenOffset()).line, n = {
						startLine: t,
						endLine: t,
						kind: 1 === a ? "object" : "array"
					};
					i.push(n);
					break;
				}
				case 2:
				case 4: {
					const t = 2 === a ? "object" : "array";
					if (i.length > 0 && i[i.length - 1].kind === t) {
						const t = i.pop(), n = e.positionAt(o.getTokenOffset()).line;
						t && n > t.startLine + 1 && s !== t.startLine && (t.endLine = n - 1, l(t), s = t.startLine);
					}
					break;
				}
				case 13: {
					const t = e.positionAt(o.getTokenOffset()).line, n = e.positionAt(o.getTokenOffset() + o.getTokenLength()).line;
					1 === o.getTokenError() && t + 1 < e.lineCount ? o.setPosition(e.offsetAt(Bs.create(t + 1, 0))) : t < n && (l({
						startLine: t,
						endLine: n,
						kind: Gs.Comment
					}), s = t);
					break;
				}
				case 12: {
					const t = e.getText().substr(o.getTokenOffset(), o.getTokenLength()).match(/^\/\/\s*#(region\b)|(endregion\b)/);
					if (t) {
						const n = e.positionAt(o.getTokenOffset()).line;
						if (t[1]) {
							const e = {
								startLine: n,
								endLine: n,
								kind: Gs.Region
							};
							i.push(e);
						} else {
							let e = i.length - 1;
							for (; e >= 0 && i[e].kind !== Gs.Region;) e--;
							if (e >= 0) {
								const t = i[e];
								i.length = e, n > t.startLine && s !== t.startLine && (t.endLine = n, l(t), s = t.startLine);
							}
						}
					}
					break;
				}
			}
			a = o.scan();
		}
		const u = t && t.rangeLimit;
		if ("number" != typeof u || n.length <= u) return n;
		t && t.onRangeLimitExceeded && t.onRangeLimitExceeded(e.uri);
		const c = [];
		for (let m of r) m < 30 && (c[m] = (c[m] || 0) + 1);
		let h = 0, d = 0;
		for (let m = 0; m < c.length; m++) {
			const e = c[m];
			if (e) {
				if (e + h > u) {
					d = m;
					break;
				}
				h += e;
			}
		}
		const f = [];
		for (let m = 0; m < n.length; m++) {
			const e = r[m];
			"number" == typeof e && (e < d || e === d && h++ < u) && f.push(n[m]);
		}
		return f;
	}
	function Rl(e, t, n) {
		function r(t, n) {
			return $s.create(e.positionAt(t), e.positionAt(n));
		}
		const i = ks(e.getText(), !0);
		function s(e, t) {
			return i.setPosition(e), i.scan() === t ? i.getTokenOffset() + i.getTokenLength() : -1;
		}
		return t.map(function(t) {
			let i = e.offsetAt(t), o = n.getNodeFromOffset(i, !0);
			const a = [];
			for (; o;) {
				switch (o.type) {
					case "string":
					case "object":
					case "array":
						const e = o.offset + 1, t = o.offset + o.length - 1;
						e < t && i >= e && i <= t && a.push(r(e, t)), a.push(r(o.offset, o.offset + o.length));
						break;
					case "number":
					case "boolean":
					case "null":
					case "property": a.push(r(o.offset, o.offset + o.length));
				}
				if ("property" === o.type || o.parent && "array" === o.parent.type) {
					const e = s(o.offset + o.length, 5);
					-1 !== e && a.push(r(o.offset, e));
				}
				o = o.parent;
			}
			let l;
			for (let e = a.length - 1; e >= 0; e--) l = jo.create(a[e], l);
			return l || (l = jo.create($s.create(t, t))), l;
		});
	}
	function Tl(e, t, n) {
		let r;
		if (n) {
			const t = e.offsetAt(n.start);
			r = {
				offset: t,
				length: e.offsetAt(n.end) - t
			};
		}
		const i = {
			tabSize: t ? t.tabSize : 4,
			insertSpaces: !0 === t?.insertSpaces,
			insertFinalNewline: !0 === t?.insertFinalNewline,
			eol: "\n",
			keepLines: !0 === t?.keepLines
		};
		return function(e, t, n) {
			return Ns(e, t, n);
		}(e.getText(), r, i).map((t) => no.replace($s.create(e.positionAt(t.offset), e.positionAt(t.offset + t.length)), t.content));
	}
	var Ml;
	(function(e) {
		e[e.Object = 0] = "Object", e[e.Array = 1] = "Array";
	})(Ml || (Ml = {}));
	var Ol = class {
		constructor(e, t) {
			this.propertyName = e ?? "", this.beginningLineNumber = t, this.childrenProperties = [], this.lastProperty = !1, this.noKeyName = !1;
		}
		addChildProperty(e) {
			if (e.parent = this, this.childrenProperties.length > 0) {
				let t = 0;
				t = e.noKeyName ? this.childrenProperties.length : function(e, t, n) {
					const r = t.propertyName.toLowerCase(), i = e[0].propertyName.toLowerCase(), s = e[e.length - 1].propertyName.toLowerCase();
					if (r < i) return 0;
					if (r > s) return e.length;
					let o = 0, a = e.length - 1;
					for (; o <= a;) {
						let r = a + o >> 1, i = n(t, e[r]);
						if (i > 0) o = r + 1;
						else {
							if (!(i < 0)) return r;
							a = r - 1;
						}
					}
					return -o - 1;
				}(this.childrenProperties, e, Il), t < 0 && (t = -1 * t - 1), this.childrenProperties.splice(t, 0, e);
			} else this.childrenProperties.push(e);
			return e;
		}
	};
	function Il(e, t) {
		const n = e.propertyName.toLowerCase(), r = t.propertyName.toLowerCase();
		return n < r ? -1 : n > r ? 1 : 0;
	}
	function Pl(e, t) {
		const n = {
			...t,
			keepLines: !1
		}, r = wa.applyEdits(e, Tl(e, n, void 0)), i = wa.create("test://test.json", "json", 0, r), s = function(e, t) {
			if (0 === t.childrenProperties.length) return e;
			const n = wa.create("test://test.json", "json", 0, e.getText()), r = [];
			Vl(r, t, t.beginningLineNumber);
			for (; r.length > 0;) {
				const t = r.shift(), i = t.propertyTreeArray;
				let s = t.beginningLineNumber;
				for (let o = 0; o < i.length; o++) {
					const t = i[o], a = $s.create(Bs.create(t.beginningLineNumber, 0), Bs.create(t.endLineNumber + 1, 0)), l = e.getText(a), u = wa.create("test://test.json", "json", 0, l);
					if (!0 === t.lastProperty && o !== i.length - 1) {
						const e = t.lineWhereToAddComma - t.beginningLineNumber, n = t.indexWhereToAddComa, r = {
							range: $s.create(Bs.create(e, n), Bs.create(e, n)),
							text: ","
						};
						wa.update(u, [r], 1);
					} else if (!1 === t.lastProperty && o === i.length - 1) {
						const e = t.commaIndex, n = t.commaLine - t.beginningLineNumber, r = {
							range: $s.create(Bs.create(n, e), Bs.create(n, e + 1)),
							text: ""
						};
						wa.update(u, [r], 1);
					}
					const c = t.endLineNumber - t.beginningLineNumber + 1, h = {
						range: $s.create(Bs.create(s, 0), Bs.create(s + c, 0)),
						text: u.getText()
					};
					wa.update(n, [h], 1), Vl(r, t, s), s += c;
				}
			}
			return n;
		}(i, function(e) {
			const t = ks(e.getText(), !1);
			let n, r, i, s = new Ol(), o = s, a = s, l = s, u = 0, c = 0, h = -1, d = -1, f = 0, m = 0, g = [], p = !1, b = !1;
			for (; 17 !== (n = t.scan());) {
				if (!0 === p && 14 !== n && 15 !== n && 12 !== n && 13 !== n && void 0 === a.endLineNumber) {
					let e = t.getTokenStartLine();
					2 === i || 4 === i ? l.endLineNumber = e - 1 : a.endLineNumber = e - 1, f = e, p = !1;
				}
				if (!0 === b && 14 !== n && 15 !== n && 12 !== n && 13 !== n && (f = t.getTokenStartLine(), b = !1), t.getTokenStartLine() !== u) {
					for (let n = u; n < t.getTokenStartLine(); n++) c += e.getText($s.create(Bs.create(n, 0), Bs.create(n + 1, 0))).length;
					u = t.getTokenStartLine();
				}
				switch (n) {
					case 10:
						if (void 0 === r || 1 === r || 5 === r && g[g.length - 1] === Ml.Object) {
							const e = new Ol(t.getTokenValue(), f);
							l = a, a = o.addChildProperty(e);
						}
						break;
					case 3:
						if (void 0 === s.beginningLineNumber && (s.beginningLineNumber = t.getTokenStartLine()), g[g.length - 1] === Ml.Object) o = a;
						else if (g[g.length - 1] === Ml.Array) {
							const e = new Ol(t.getTokenValue(), f);
							e.noKeyName = !0, l = a, a = o.addChildProperty(e), o = a;
						}
						g.push(Ml.Array), a.type = Ml.Array, f = t.getTokenStartLine(), f++;
						break;
					case 1:
						if (void 0 === s.beginningLineNumber) s.beginningLineNumber = t.getTokenStartLine();
						else if (g[g.length - 1] === Ml.Array) {
							const e = new Ol(t.getTokenValue(), f);
							e.noKeyName = !0, l = a, a = o.addChildProperty(e);
						}
						a.type = Ml.Object, g.push(Ml.Object), o = a, f = t.getTokenStartLine(), f++;
						break;
					case 4:
						m = t.getTokenStartLine(), g.pop(), void 0 !== a.endLineNumber || 2 !== r && 4 !== r || (a.endLineNumber = m - 1, a.lastProperty = !0, a.lineWhereToAddComma = h, a.indexWhereToAddComa = d, l = a, a = a ? a.parent : void 0, o = a), s.endLineNumber = m, f = m + 1;
						break;
					case 2:
						m = t.getTokenStartLine(), g.pop(), 1 !== r && (void 0 === a.endLineNumber && (a.endLineNumber = m - 1, a.lastProperty = !0, a.lineWhereToAddComma = h, a.indexWhereToAddComa = d), l = a, a = a ? a.parent : void 0, o = a), s.endLineNumber = t.getTokenStartLine(), f = m + 1;
						break;
					case 5:
						m = t.getTokenStartLine(), void 0 !== a.endLineNumber || g[g.length - 1] !== Ml.Object && (g[g.length - 1] !== Ml.Array || 2 !== r && 4 !== r) || (a.endLineNumber = m, a.commaIndex = t.getTokenOffset() - c, a.commaLine = m), 2 !== r && 4 !== r || (l = a, a = a ? a.parent : void 0, o = a), f = m + 1;
						break;
					case 13: 5 !== r || h !== t.getTokenStartLine() || (g[g.length - 1] !== Ml.Array || 2 !== i && 4 !== i) && g[g.length - 1] !== Ml.Object || (g[g.length - 1] !== Ml.Array || 2 !== i && 4 !== i) && g[g.length - 1] !== Ml.Object || (a.endLineNumber = void 0, p = !0), 1 !== r && 3 !== r || h !== t.getTokenStartLine() || (b = !0);
				}
				14 !== n && 13 !== n && 12 !== n && 15 !== n && (i = r, r = n, h = t.getTokenStartLine(), d = t.getTokenOffset() + t.getTokenLength() - c);
			}
			return s;
		}(i)), o = Tl(s, n, void 0), a = wa.applyEdits(s, o);
		return [no.replace($s.create(Bs.create(0, 0), e.positionAt(e.getText().length)), a)];
	}
	function Vl(e, t, n) {
		if (0 !== t.childrenProperties.length) if (t.type === Ml.Object) {
			let r = Infinity;
			for (const e of t.childrenProperties) e.beginningLineNumber < r && (r = e.beginningLineNumber);
			n += r - t.beginningLineNumber, e.push(new Dl(n, t.childrenProperties));
		} else t.type === Ml.Array && Fl(e, t, n);
	}
	function Fl(e, t, n) {
		for (const r of t.childrenProperties) {
			if (r.type === Ml.Object) {
				let i = Infinity;
				for (const e of r.childrenProperties) e.beginningLineNumber < i && (i = e.beginningLineNumber);
				const s = i - r.beginningLineNumber;
				e.push(new Dl(n + r.beginningLineNumber - t.beginningLineNumber + s, r.childrenProperties));
			}
			r.type === Ml.Array && Fl(e, r, n + r.beginningLineNumber - t.beginningLineNumber);
		}
	}
	var Dl = class {
		constructor(e, t) {
			this.beginningLineNumber = e, this.propertyTreeArray = t;
		}
	};
	function ql(e, t) {
		const n = [];
		return t.visit((r) => {
			if ("property" === r.type && "$ref" === r.keyNode.value && "string" === r.valueNode?.type) {
				const s = function(e, t) {
					const n = function(e) {
						return "#" === e ? [] : "#" !== e[0] || "/" !== e[1] ? null : e.substring(2).split(/\//).map($l);
					}(t);
					return n ? Bl(n, e.root) : null;
				}(t, r.valueNode.value);
				if (s) {
					const t = e.positionAt(s.offset);
					n.push({
						target: `${e.uri}#${t.line + 1},${t.character + 1}`,
						range: Kl(e, r.valueNode)
					});
				}
			}
			return !0;
		}), Promise.resolve(n);
	}
	function Kl(e, t) {
		return $s.create(e.positionAt(t.offset + 1), e.positionAt(t.offset + t.length - 1));
	}
	function Bl(e, t) {
		if (!t) return null;
		if (0 === e.length) return t;
		const n = e.shift();
		if (t && "object" === t.type) {
			const r = t.properties.find((e) => e.keyNode.value === n);
			return r ? Bl(e, r.valueNode) : null;
		}
		if (t && "array" === t.type && n.match(/^(0|[1-9][0-9]*)$/)) {
			const r = Number.parseInt(n), i = t.items[r];
			return i ? Bl(e, i) : null;
		}
		return null;
	}
	function $l(e) {
		return e.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	function Ul(e) {
		const t = e.promiseConstructor || Promise, n = new Ll(e.schemaRequestService, e.workspaceContext, t);
		n.setSchemaContributions(ml);
		const r = new tl(n, e.contributions, t, e.clientCapabilities), i = new nl(n, e.contributions, t), s = new hl(n), o = new il(n, t);
		return {
			configure: (e) => {
				n.clearExternalSchemas(), e.schemas?.forEach(n.registerExternalSchema.bind(n)), o.configure(e);
			},
			resetSchema: (e) => n.onResourceChange(e),
			doValidation: o.doValidation.bind(o),
			getLanguageStatus: o.getLanguageStatus.bind(o),
			parseJSONDocument: (e) => Ya(e, { collectComments: !0 }),
			newJSONDocument: (e, t) => function(e, t = []) {
				return new Xa(e, t, []);
			}(e, t),
			getMatchingSchemas: n.getMatchingSchemas.bind(n),
			doResolve: r.doResolve.bind(r),
			doComplete: r.doComplete.bind(r),
			findDocumentSymbols: s.findDocumentSymbols.bind(s),
			findDocumentSymbols2: s.findDocumentSymbols2.bind(s),
			findDocumentColors: s.findDocumentColors.bind(s),
			getColorPresentations: s.getColorPresentations.bind(s),
			doHover: i.doHover.bind(i),
			getFoldingRanges: kl,
			getSelectionRanges: Rl,
			findDefinition: () => Promise.resolve([]),
			findLinks: ql,
			format: (e, t, n) => Tl(e, n, t),
			sort: (e, t) => Pl(e, t)
		};
	}
	let jl;
	"undefined" != typeof fetch && (jl = function(e) {
		return fetch(e).then((e) => e.text());
	});
	var Wl = class {
		constructor(e, t) {
			this._ctx = e, this._languageSettings = t.languageSettings, this._languageId = t.languageId, this._languageService = Ul({
				workspaceContext: { resolveRelativePath: (e, t) => function(e, t) {
					if (function(e) {
						return e.charCodeAt(0) === zl;
					}(t)) {
						const n = bl.parse(e), r = t.split("/");
						return n.with({ path: Gl(r) }).toString();
					}
					return function(e, ...t) {
						const n = bl.parse(e), r = n.path.split("/");
						for (let i of t) r.push(...i.split("/"));
						return n.with({ path: Gl(r) }).toString();
					}(e, t);
				}(t.substr(0, t.lastIndexOf("/") + 1), e) },
				schemaRequestService: t.enableSchemaRequest ? jl : void 0,
				clientCapabilities: Sa.LATEST
			}), this._languageService.configure(this._languageSettings);
		}
		async doValidation(e) {
			let t = this._getTextDocument(e);
			if (t) {
				let e = this._languageService.parseJSONDocument(t);
				return this._languageService.doValidation(t, e, this._languageSettings);
			}
			return Promise.resolve([]);
		}
		async doComplete(e, t) {
			let n = this._getTextDocument(e);
			if (!n) return null;
			let r = this._languageService.parseJSONDocument(n);
			return this._languageService.doComplete(n, t, r);
		}
		async doResolve(e) {
			return this._languageService.doResolve(e);
		}
		async doHover(e, t) {
			let n = this._getTextDocument(e);
			if (!n) return null;
			let r = this._languageService.parseJSONDocument(n);
			return this._languageService.doHover(n, t, r);
		}
		async format(e, t, n) {
			let r = this._getTextDocument(e);
			if (!r) return [];
			let i = this._languageService.format(r, t, n);
			return Promise.resolve(i);
		}
		async resetSchema(e) {
			return Promise.resolve(this._languageService.resetSchema(e));
		}
		async findDocumentSymbols(e) {
			let t = this._getTextDocument(e);
			if (!t) return [];
			let n = this._languageService.parseJSONDocument(t), r = this._languageService.findDocumentSymbols2(t, n);
			return Promise.resolve(r);
		}
		async findDocumentColors(e) {
			let t = this._getTextDocument(e);
			if (!t) return [];
			let n = this._languageService.parseJSONDocument(t), r = this._languageService.findDocumentColors(t, n);
			return Promise.resolve(r);
		}
		async getColorPresentations(e, t, n) {
			let r = this._getTextDocument(e);
			if (!r) return [];
			let i = this._languageService.parseJSONDocument(r), s = this._languageService.getColorPresentations(r, i, t, n);
			return Promise.resolve(s);
		}
		async getFoldingRanges(e, t) {
			let n = this._getTextDocument(e);
			if (!n) return [];
			let r = this._languageService.getFoldingRanges(n, t);
			return Promise.resolve(r);
		}
		async getSelectionRanges(e, t) {
			let n = this._getTextDocument(e);
			if (!n) return [];
			let r = this._languageService.parseJSONDocument(n), i = this._languageService.getSelectionRanges(n, t, r);
			return Promise.resolve(i);
		}
		async parseJSONDocument(e) {
			let t = this._getTextDocument(e);
			if (!t) return null;
			let n = this._languageService.parseJSONDocument(t);
			return Promise.resolve(n);
		}
		async getMatchingSchemas(e) {
			let t = this._getTextDocument(e);
			if (!t) return [];
			let n = this._languageService.parseJSONDocument(t);
			return Promise.resolve(this._languageService.getMatchingSchemas(t, n));
		}
		_getTextDocument(e) {
			let t = this._ctx.getMirrorModels();
			for (let n of t) if (n.uri.toString() === e) return wa.create(e, this._languageId, n.version, n.getValue());
			return null;
		}
	};
	const zl = "/".charCodeAt(0), Hl = ".".charCodeAt(0);
	function Gl(e) {
		const t = [];
		for (const r of e) 0 === r.length || 1 === r.length && r.charCodeAt(0) === Hl || (2 === r.length && r.charCodeAt(0) === Hl && r.charCodeAt(1) === Hl ? t.pop() : t.push(r));
		e.length > 1 && 0 === e[e.length - 1].length && t.push("");
		let n = t.join("/");
		return 0 === e[0].length && (n = "/" + n), n;
	}
	self.onmessage = () => {
		var e = (e, t) => new Wl(e, t);
		self.onmessage = (t) => {
			ms((n) => e(n, t.data));
		};
	};
})();
