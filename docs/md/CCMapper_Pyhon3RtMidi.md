    
# CCMapper(RtMidi/python3)  

2022/12/18      
初版    
  
## 概要    
以前の記事でpython3のCCMapperは以前作成したが、そのときは、ゲーム用ライブラリpygameを使用した。これを実績のあるRtMidiのpythonラッパーライブラリに切り替える。  
以前の記事：[re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)　

本機能は、[WIDI Bud Pro]経由でMIDIデータをリアルタイムでCC#2またはCC#11を受信して、CC#を任意のもの(複数、AT、PPを含む)に変更して音源に送信する。Pitch_Bendは,そのまま接続されている音源に送られる。     

## 準備
linuxの場合、仮想MIDIデバイスとして、既存の[Midi Through port]を利用する。

MIDI信号の流れとしては以下のようになる：
```
[wind_controler(re.corder/Elfue etc)]→[WIDI Bud Pro]→(CCMapper)→[Midi Through Port]→ [PC音源]
```

## 準備
以下を実行してライブラリをインストールする：  
```

sudo apt install python3-rtmidi

```
pythonでありがちなpipでないので注意のこと。


## CCMapper
CCMapperのプログラムとしては以下になる：  

CCMapper_RtMidi.py
```python

#!/usr/bin/env python
#
# CCMapper_RtMidi.py
#
# written by: xshige
# 2022/12/18

import sys
import time

from rtmidi.midiconstants import (ALL_NOTES_OFF, ALL_SOUND_OFF, BALANCE, BANK_SELECT_LSB,
                                  BANK_SELECT_MSB, BREATH_CONTROLLER, CHANNEL_PRESSURE,
                                  CHANNEL_VOLUME, CONTROL_CHANGE, DATA_ENTRY_LSB, DATA_ENTRY_MSB,
                                  END_OF_EXCLUSIVE, EXPRESSION_CONTROLLER, FOOT_CONTROLLER,
                                  LOCAL_CONTROL, MIDI_TIME_CODE, MODULATION, NOTE_OFF, NOTE_ON,
                                  NRPN_LSB, NRPN_MSB, PAN, PITCH_BEND, POLY_PRESSURE,
                                  PROGRAM_CHANGE, RESET_ALL_CONTROLLERS, RPN_LSB, RPN_MSB,
                                  SONG_POSITION_POINTER, SONG_SELECT, TIMING_CLOCK)

from rtmidi.midiutil import open_midioutput
from rtmidi.midiutil import open_midiinput

def midiin_callback(event, data=None):
    message, deltatime = event
    if message[0] & 0xF0 == NOTE_ON:
        status, note, velocity = message
        channel = (status & 0xF) + 1
        print("NoteOn note:%d velocity:%d" % (note, velocity))
	curNote = note
        midiout.send_message(message)
    elif message[0] & 0xF0 == NOTE_OFF:
        status, note, velocity = message
        channel = (status & 0xF) + 1
        print("NoteOff note:%d velocity:%d" % (note, velocity))
        #curNote = note
        midiout.send_message(message)
    elif message[0] & 0xF0 == CONTROL_CHANGE:
        status, control, value = message
        channel = (status & 0xF) + 1
        print("CONTROL_CHANGE control:%d value:%d" % (control, value))
        if ((control == 2)|(control == 11)):
            message[1] = 1
            midiout.send_message(message)
            message[1] = 2
            midiout.send_message(message)
            message[1] = 7
            midiout.send_message(message)
            message[1] = 11
            midiout.send_message(message)
            message[1] = 74
            midiout.send_message(message)
            message[1] = 26
            midiout.send_message(message)
            # AT
            msg2 = [CHANNEL_PRESSURE + channel - 1]
            msg2.append(value & 0x7F)
            midiout.send_message(msg2)
            # PP
            msg2 = [POLY_PRESSURE + channel - 1]
            msg2.append(curNote & 0x7F)
            msg2.append(value & 0x7F)
            midiout.send_message(msg2)
            return
    elif message[0] & 0xF0 == CHANNEL_PRESSURE:
        value = message[0]
        channel = (status & 0xF) + 1
        print("AT(CHANNEL_PRESSURE) value:%d" % (value))
    elif message[0] & 0xF0 == POLY_PRESSURE:
        status, note, value = message
        channel = (status & 0xF) + 1
        print("PP(POLY_PRESSURE) note:%d value:%d" % (note, value))
    elif message[0] & 0xF0 == PITCH_BEND:
        value = message[0]
        print("PITCH_BEND value:%d" % (value))
        midiout.send_message(message)
        return
    else:
         print("********** unexpected message **********")

#---------------------------------------------------------

def main(args=None):
    
    global midiout
    global curNote

    curNote = 0

    midiout, outport = open_midioutput(0) # Midi Through
    print("output port: '%s'" % outport)

    #midiin, port_name = open_midiinput(args[0] if args else None)
    midiin, inport = open_midiinput(1)
    print("input port: '%s'" % inport)
    midiin.set_callback(midiin_callback)

    try:
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("Bye.")
        pass
    finally:
        midiin.close_port()
        del midiin
        midiout.close_port()
        del midiout 


if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv[1:]) or 0)

#=====================================-

```

CCMapperを起動したら、次に音源を立ち上げて入力MIDIデバイスを「Midi Through port」に設定する。

ここで、wind_controlerで吹くと音が出る。
                                                                    
なお、色々な音源で必要と思われるCC#を有効にしているので、linuxでは以下の音源が、そのまま利用できる。

1. Surge XT  
[SURGE XT - Free & Open Source Hybrid Synthesizer](https://surge-synthesizer.github.io/)  
[Surge XT User Manual](https://surge-synthesizer.github.io/manual-xt/)  
1. Vital  
[VITAL - Spectral warping wavetable synth](https://vital.audio/)  
[Get Vital](https://vital.audio/#getvital)(フリー版もある)   


## 参考情報                                    
loopMIDI関連：  
[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  
[loopMIDIでつなぐ](https://webmidiaudio.com/npage501.html)  

WIDI_Bud_Pro関連：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

PC音源関連：  
[[WS音源探訪02] Vital Free Patch for Windsynth つくってみました](https://note.com/windsynth/n/n247ac73351b8)  
wind_controler向けのパッチがあり役に立つ  
[[WS音源探訪01] Vital](https://note.com/windsynth/n/na3b11d4a4f8e)  
[【無料】VitalAudioのWaveTableシンセVitalの紹介](https://chilloutwithbeats.com/vitalaudio-wavetable-vital-intro/)  
[Macことはじめ/仮想MIDIデバイスの設定,Bluetooth_MIDIデバイスの接続](https://xshigee.github.io/web0/md/Mac_beginner.html)  
[Respiro(VST3)を使ってみる](https://xshigee.github.io/web0/md/Respiro.html)  
[Lyrihorn 2(VST3)を使ってみる](https://xshigee.github.io/web0/md/re.corder_Lyrihorn-2.html)  
[EVI-NER(VST3)を使ってみる](https://xshigee.github.io/web0/md/re.corder_EVI-NER.html)  
[re.corder/Elefueに外部音源(Aria/Windows)を接続する(WIDI_Bud_Pro経由)](https://xshigee.github.io/web0/md/re.corder_Aria.html)  
[EWI5000をソフト音源(IFW)と接続する](https://xshigee.github.io/web0/md/EWI5000_IFW.html)  

re.corder関連：  
[owner’s manual re.corder](http://www.artinoise.com/wp-content/uploads/2021/02/artinoise-recorder-manual-ENG-v10.pdf)  
[re.corder Downloads](https://www.recorderinstruments.com/en/support-downloads/)  
[re.corder Frequently Asked Questions](https://www.recorderinstruments.com/en/frequently-asked-questions/)    

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Midi View](https://hautetechnique.com/midi/midiview/)  

ASIO関連：  
[asio4all - ASIOドライバーのないオーディオインターフェイスをASIO対応にできるソフト](https://forest.watch.impress.co.jp/library/software/asio4all/)

Aria関連：  
[EWI MASTER BOOK CD付教則完全ガイド【改訂版】](https://www.alsoj.net/store/view/ALEWIS1-2.html#.YmNpctpBxPY)のp100-p119の音色の設定方法がある

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

