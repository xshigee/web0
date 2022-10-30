    
# re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)    

2022/10/29+      
初版    
  
## 概要    
re.corder/ElefueにWIDI_Bud_Pro経由で外部音源(Aria/Windows)を接続する際、特にElefueは送信するCC#が11に固定されていてブレスによるコントロールが
Aria音源に反映できず表現力に乏しい。  
これを解決するためにリアルタイムでCC#を任意のものに変更するCCMapperをpythonで実装した。  
re.coderを使用する際もCCMapperを使用しない場合、ブレスコントールできるCCが一つに限定されるが、これを複数のCCに変換できる。  

## 準備
pythonのライブラリが必要となるので  
以下を実行してインストールする：
```
pip install pygame

``` 
また、仮想MIDIデバイスとして、loopMIDIがインストールされている必要がある。

MIDI信号の流れとしては以下のようになる：
```
[wind_controler(re.corder/Elfue)]→[WIDI Bud Pro]→(CCMapper)→[loopMIDI]→ [PC音源]
```


## CCMapper
pythonのスクリプトとしては以下を使用する：  
CCMapper.py  
```python
# CC# Mapper (2022/10/29)

import pygame.midi as m

m.init()

print('MIDI device list:')             
i_num=m.get_count() # number of MIDI device
for i in range(i_num):
  print(i,":",m.get_device_info(i)) # MIDI device info.

i = m.Input(2) #'WIDI Bud Pro' 
#o = m.Output(4) #'Microsoft GS Wavetable Synth'
o = m.Output(6) #'loopMIDI Port 1'

while True:
  if i.poll(): # １ on received MIDI
    midi_events = i.read(4)
    for j in range(len(midi_events)):
      status=midi_events[j][0][0]
      data1 =midi_events[j][0][1]
      data2 =midi_events[j][0][2]
      if(status==0x80 or status==0x90): # NoteOn or NoteOff
        o.write_short(status,data1,data2)
      elif (data1==11): # when BC assigned to expression(11)
        # for Aria
        o.write_short(status,2,data2) 
        o.write_short(status,7,data2)  
        o.write_short(status,26,data2)    
      elif (data1==2): # when BC assigned to breath(2)
        # for Aria
        o.write_short(status,2,data2) 
        o.write_short(status,7,data2)  
        o.write_short(status,26,data2)   
      elif (data1==7): # when BC assigned to volume(7)
        o.write_short(status,data1,data2)
      elif (data1==1): # modulation(1)
        #print(data1,":",data2)
        o.write_short(status,data1,data2) 
      else:
        print(data1,":",data2)
        o.write_short(status,data1,data2)
i.close()

```                  

以下の部分は実行環境に合わせて変更すること：  
```
i = m.Input(2) #'WIDI Bud Pro' 
#o = m.Output(4) #'Microsoft GS Wavetable Synth'
o = m.Output(6) #'loopMIDI Port 1'

```

## 接続
上の準備が終われば、re.coder/Elefueの電源を入れてbluetoothをオンにすれば
自動的にWIDI_Bud_Proと接続し、接続するとWIDI_Bud_ProのLEDの色がシアンに変る。  
                                                           
この後、CCMapper.pyをPowerShellで実行する：
```
python CCMapper.py

#出力例
pygame 2.1.2 (SDL 2.0.18, Python 3.10.1)
Hello from the pygame community. https://www.pygame.org/contribute.html
MIDI device list:
0 : (b'MMSystem', b'Microsoft MIDI Mapper', 0, 1, 0)
1 : (b'MMSystem', b'loopMIDI Port 1', 1, 0, 0)
2 : (b'MMSystem', b'WIDI Bud Pro', 1, 0, 0)
3 : (b'MMSystem', b'CoolSoft MIDIMapper', 0, 1, 0)
4 : (b'MMSystem', b'Microsoft GS Wavetable Synth', 0, 1, 0)
5 : (b'MMSystem', b'VirtualMIDISynth #1', 0, 1, 0)
6 : (b'MMSystem', b'loopMIDI Port 1', 0, 1, 0)
7 : (b'MMSystem', b'WIDI Bud Pro', 0, 1, 0)


```
なお、上のデバイスリストは実行環境によって異なる。

次に音源を立ち上げて入力MIDIデバイスを「loopMIDI port」に設定する。

ここで、wind_controlerで吹くと音が出る。
                                                                    
なお、Ariaだけでなく、Lyrihorn-2(VST3)、EVI-NER(VST3)、IFW(VST3)も
CCMapper経由で、そのまま使用できる。


## Ariaの場合
1. ソフト音源Ariaを立ち上げる。
1. Tools/Preferenceを選択して以下を設定する：  
  Input MIDI Device: loopMIDI Port 1(in)  
  Output MIDI Devices: 何も設定しない (Aria自身が音源なので外部音源は不要)  
  Adudio Device API: ASIO (ASIO4ALLインストール済みの前提)  
  Audio Device: ASIO4ALL (ASIO4ALLインストール済みの前提)  
1. Tools/EWI Configuration EWI_USBの設定らしいので、今回の場合、なにもしない。  
1. 音色を選択する  

## re.corderのMIDI設定  
CCMapperでリアルタイムに変更されるがデフォルトとして以下を設定する：

1. Pressure(breath)のCCはデフォルトでは#11(expression)になっているので、それを#2(breath control)に変更する。  
   Curveはembedded1にする。(任意)  
1. RotationのCCはデフォルトでは#52になっているので、それを#7(volume)に変更する。  
   Curveはembedded1にする。(任意だがCurveの値によっては音がならない可能性あり)  
1. MIDI-CHは、1を前提にしているので、音が出ないようなら、ここを変更する。  

参考：
re.corderのMIDI設定のデフォルト(FAQより)
```
The following are the DEFAULT SETTINGS you need to restore:

Sensitivity
threshold= standard (try ‘low’ if you feel like you’re blowing too much)
speed= 80
MIDI Ch= 1

Pressure
curves= linear (try ’embedded1′ ’embedded2′ or ’embedded3′ if you feel like you’re blowing too much)
aftertouch= off
MIDIOut= 11
# CC#11はexpressionに対応している。

Incliation(Tilt)
curves= embedded12 (set to none if you want to turn off vibrato)
MIDIOut=1
# CC#1はmodulationに対応しているので、re.corderを傾けるとmodulationが変化する

Rotation
curve= embedded13
MIDIOut= 52
# re.corderを左右に振ると変化する

Z axis
curve= None (OFF)
MIDIOut= 53
```                                          

## 改善
使用しているPCによっては、CCMapper.pyの処理でもたつくことがあるので
wind_controlerの出力するCC#を、1と2、または、1と11に限定したほうが良いようだ。  


## CCMapperの今後の改良点
現在、マップしたCCの値は同じ値を使っているが、
できればCC#に応じて値(data2)を変更できたほうが
違う表情をつかることができると思われる。  


## 参考情報                                    
pygame.midi関連：  
[PythonでMIDI](https://webmidiaudio.com/npage507.html)  
[pygame.midi](https://runebook.dev/ja/docs/pygame/ref/midi)   

loopMIDI関連：  
[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  
[loopMIDIでつなぐ](https://webmidiaudio.com/npage501.html)  

WIDI_Bud_Pro関連：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

PC音源関連：  
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

