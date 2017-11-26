function bufferSlide(size = 10, startByte = 0, badBytes = []) {
  this.startByte = startByte === 0 ? 0 : startByte | 0 || 48;
  this._buffer = Number(buffer) ? new Uint8ClampedArray(size) : buffer;
  this.setBad(badBytes)
  this._slides = 0;
}

const checkLowHigh = ()=> {
  if(!this._high) this._high = this._low;
  if(!this._low) this._low = 0;
  if(+this._low > +this._high) {
    throw new Error("Higher _low than _high.");
    return false
  }
  return true
}

bufferSlide.prototype = {
  get buffer() { return this._buffer.join(".").split(".").map(_=>String.fromCharCode(_)) },
  get raw() { return this._buffer }, set raw(val) { return !!(this._buffer = val) },
  set buffer(val) {
    val.constructor.name === 'String' ?
      this._buffer = new Uint8Array(Buffer.from(val))
    :
      this._buffer = val > 0xffff ? val > 0xffffffff ? new Uint32Array(val) : new Uint16Array(val) : new Uint8ClampedArray(val);

    try { this._buffer = Buffer.from(val + "") }
    catch(e) { "Error: Cannot create buffer from value." }
    return this || null;
  }
};

bufferSlide.prototype.slide = function (i = 0, slide = 0,  max_i, byteOffset = 0,  preserve = true){
 if(!this._badBytes || !this._badBytes.length) return this;
  this._slidBytes = this._slideBytes || 0;
  if(!i) i = this._badBytes.length;
  var badBytes = Array.from(this._badBytes);

  if(typeof this._badBytes[i] === 'Array') {
     this._low = this._badBytes[i][0];
     this._high = this._badBytes[i][this._badBytes.length-1];
     this._badBytes.shift();
  } else {
    this._low = this._badBytes.shift();
    this._high = this._badBytes.shift();
  }
  byteOffset += slide;
  slide += this._high|0 - this._low|0;
  this._buffer.copyWithin(byteOffset + slide, byteOffset, this._low|0);
  this._slides++;

  this['_slidOffBuffer__'+this._slides] = [this._buffer.slice(0, byteOffset + slide)];
  this['_patchedBuffer__'+this._slides] = [this._buffer.slice(byteOffset + slide)];

  this._slidBytes += slide;

  if(i++ === badBytes.length) {
    this._slidIndexes = badBytes;
    this._final = this._buffer.slice(byteOffset + slide);
    return this
  } else {
    this.slide(i, slide, max_i, byteOffset, preserve);
  }
};

bufferSlide.prototype.setBad = function() {
  // coerce to array.
  var val = arguments;
  if(!val) return this;
  if(val.low) val = [val.low|0, val.high|0];
  else val = typeof val[0] !== "String" ? [].slice.call(val) : val[0].split(/\s*,\s*/);
  let check;
  if(check = /(\d+)..(\d+)/.exec(val[0])) {
    res = [];
    for(let i = 0, l = val.length; i < l; ++i) {
      let check = /(\d+)..(\d+)/.exec(val[i])
      res.push(check[1], check[2])
    }
    val = res;
  }
  this._badBytes = [];
  var val_copy = Array.from(val);
  var i = 0; l = val.length;
  while(l--) {
    let ival = val[i];
    if (Number.isInteger(ival)) {
      low = val_copy.shift();
      high = val_copy.shift();
      --l;
    } else if(Array.isArray(ival)) {
      low = val[i][0];
      high = val[i][val.length-1]
    }
    this._badBytes.push(low, high);
    ++i
  }
  return this
};

bufferSlide.prototype.nfill = function(len) {
  len === undefined && (len = this._buffer.length);
  this._buffer = this._buffer.map(((i)=>()=>len>i&&i++)(0));
  this._originalBuffer = this._buffer;
  return this
}

bufferSlide.prototype.toString = function() {
  if(!this._final) this._final = this._buffer;
  var res = "";
  var buf = this._final || this._buffer;
  for(let i = 0, l = this._buffer.length; i< l; ++i) {
    res += String.fromCharCode(buf[i])
  }

  return res
}

bufferSlide.prototype.toArray = function() {
  if(!this._final) this._final = this._buffer;
  var res = [];
  var buf = this._final || this._buffer;
  for(let i = 0, l = this._buffer.length; i < l; ++i) {
    res[i] = String.fromCharCode(buf[i])
  }

  return res
}


try { module.exports = bufferSlide } catch(e) { window.bufferSlide = bufferSlide }
