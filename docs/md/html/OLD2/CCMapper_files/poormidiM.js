// proormidiM.js
// 2023/1/2: modified for CCMapper (last M means 'Modified')

// poormidi.js (Very Poor) Web MIDI API Wrapper
// For Google Chrome Only :D

// 2015.02.23 Change for P&P on Chrome Canary !!!! (W.I.P. and experimental now)
// 2015.06.07 P&P feature has now supported.
// 2015.08.08 add sendCtlChange()
// 2015.08.08 On sendNoteOn(), sendNoteOff() and sendCtlChange(), 
//            arguments are now able to set midi-channel,
//            and also these can be omitted.
//            See also comments in this code, for details.

(function () {
  // input/output MIDI device related
  const indev0 = "WIDI Bud"; // for Windows/linux
  const indev1 = "Elefue"; // for Mac
  const indev2 = "re.corder"; // for Mac
  const indev3 = "Nu"; // for Mac (with WIDI Master/NuRAD,NuEVI)
  const indev4 = "EWI"; // for Mac (with WIDI Master/EWI5000,EWI4000,EVI3010 etc)
  const indev5 = "AE-"; // for Mac (Roland)
  const indev6 = "YDS-"; // for Mac (YAMAHA)
  const outdev0 = "loopMIDI"; // for Windows/Mac
  const outdev1 = "Midi Through"; // for linux
  var innum = 1;
  var outnum = 1;

  var indevx  = "input device not found";
  var outdevx = "output device not found";

  poormidi = function(){
    this.midi = null;
    this.inputs = [];
    this.outputs = [];
    this.timer = null;

    this.success = function(access){
      console.log("poormidi.success()");
      this.midi = access;
      this.refreshPorts();
      this.midi.onstatechange = this.onStateChange;
    }.bind(this);

    this.failure = function(msg){
      console.log("poormidi.failure(): "+msg);
    }.bind(this);

    // new function 2023/1/1
    this.getIOdevName = function(){
      return [indevx,outdevx];
    }.bind(this);

    this.onMidiEvent = function(e){
      console.log("poormidi.onMidiEvent()");
    }.bind(this);

    this.setHandler = function(func){
      console.log("poormidi.setHandler()");
      this.onMidiEvent = func.bind(this);
    }.bind(this);

    this.sendNoteOn = function(){
      console.log("poormidi.sendNoteOn()");
      var note = 0;
      var velocity = 100;
      var channel = 0;
      if(arguments.length == 1){
        // midi.sendNoteOn(note);
        note = arguments[0];
      }else if(arguments.length == 2){
        // midi.sendNoteOn(note,velocity);
        note = arguments[0];
        velocity = arguments[1];
      }else if(arguments.length == 3){
        // midi.sendNoteOn(channel,note,velocity);
        channel = arguments[0] & 0x0f;
        note = arguments[1];
        velocity = arguments[2];
      }else{
        console.log("poormidi.sendNoteOn:parameter error!!");
        return;
      }
      /*  
      if(this.outputs.length > 0){
        for(var cnt=0;cnt<this.outputs.length;cnt++){
          console.log("poormidi.sendNoteOn() output to :"+this.outputs[cnt].name);
          this.outputs[cnt].send([0x90|channel,note&0x7f,velocity&0x7f]);
        }
      }
      */
      this.outputs[outnum].send([0x90|channel,note&0x7f,velocity&0x7f]);
    }.bind(this);

    this.sendNoteOff = function(){
      console.log("poormidi.sendNoteOff()");
      var note = 0;
      var channel = 0;
      if(arguments.length == 1){
        // midi.sendNoteOff(note);
        note = arguments[0];
      }else if(arguments.length == 2){
        // midi.sendNoteOff(channel,note);
        channel = arguments[0] & 0x0f;
        note = arguments[1];
      }else{
        console.log("poormidi.sendNoteOff:parameter error!!");
        return;
      } 
      this.outputs[outnum].send([0x80|channel,note,0]);
    }.bind(this);

    this.sendCtlChange = function(){
      console.log("poormidi.sendCtlChange()");
      var channel = 0;
      var number = 0;
      var value = 0;
      if(arguments.length == 2){
        // midi.sendCtlChange(number,value);
        number = arguments[0];
        value = arguments[1];
      }else if(arguments.length == 3){
        // midi.sendCtlChange(channel,number,value);
        channel = arguments[0] & 0x0f;
        number = arguments[1];
        value = arguments[2];
      }else{
        console.log("poormidi.sendCtlChange:parameter error!!");
        return;
      }
      this.outputs[outnum].send([0xB0|channel,number&0x7f,value&0x7f]);
    }.bind(this);


this.send = function(){
      console.log("poormidi.send()");
      var a0 = 0;
      var a1 = 0;
      var a2 = 0;
      if(arguments.length == 2){
        a0 = arguments[0];
        a1 = arguments[1];
        this.outputs[outnum].send([a0,a1]);
        return;
      }else if(arguments.length == 3){
        a0 = arguments[0];
        a1 = arguments[1];
        a2 = arguments[2];
        this.outputs[outnum].send([a0,a1,a2]);
        return;        
      }else{
        console.log("poormidi.send:parameter error!!");
        return;
      }
    }.bind(this);

    this.onStateChange = function(){
      console.log("poormidi.onStateChange()");
      if(this.timer != null){
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(function(){
        this.refreshPorts();
        this.timer = null;
      }.bind(this),300);
    }.bind(this);

    this.refreshPorts = function(){
      console.log("poormidi.refreshPorts()");
      this.inputs = [];
      this.outputs = [];

      // inputs
      var it = this.midi.inputs.values();
      var num = 0;
      for(var o = it.next(); !o.done; o = it.next()){
        this.inputs.push(o.value);
        console.log("input port: "+o.value.name);
        if (o.value.name.includes(indev0)) {
          innum = num;
          break;
        }
        if (o.value.name.includes(indev1)) {
          innum = num;
          break;
        }
        if (o.value.name.includes(indev2)) {
          innum = num;
          break;
        }
        if (o.value.name.includes(indev3)) {
          innum = num;
          break;
        }
        if (o.value.name.includes(indev4)) {
          innum = num;
          break;
        }
        if (o.value.name.includes(indev5)) {
          innum = num;
          break;
        }
        if (o.value.name.includes(indev6)) {
          innum = num;
          break;
        }
        num ++;
      }
      /*
      console.log("poormidi.refreshPorts() inputs: "+this.inputs.length);
      for(var cnt=0;cnt<this.inputs.length;cnt++){
        this.inputs[cnt].onmidimessage = this.onMidiEvent;
      }
      */
      this.inputs[innum].onmidimessage = this.onMidiEvent;

      // outputs
      var ot = this.midi.outputs.values();
      num = 0;
      for(var o = ot.next(); !o.done; o = ot.next()){
        this.outputs.push(o.value);
        console.log("output port: "+o.value.name);
        if (o.value.name.includes(outdev0)) {
          outnum = num;
          break;
        } else if (o.value.name.includes(outdev1)) {
          outnum = num;
          break;
        }
        num++;
      }
      console.log("poormidi.refreshPorts() outputs: "+this.outputs.length);
      // debug
      console.log("in:"+innum+" out:"+outnum);
      console.log(this.inputs[innum].name+" -> "+this.outputs[outnum].name);
      // save input/output dev name
      indevx = this.inputs[innum].name;
      outdevx = this.outputs[outnum].name;
    }.bind(this);

    this.onConnect = function(e){
      console.log("poormidi.onConnect()");
    }
    this.onDisConnect = function(e){
      console.log("poormidi.onDisConnect()");
    }

    navigator.requestMIDIAccess().then(this.success,this.failure);
  };

}).call(this);

