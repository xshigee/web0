    
# re.corder fingering chart   

2022/10/17     
初版    
  
## 概要
ウィンドコントローラのre.corder([https://recorderinstruments.co.jp/ja/](https://recorderinstruments.co.jp/ja/))は、フィンガーリングがカスタマイズでき、いくつかのフィンガリングを予め持っていて、bluetooth経由で設定できる。フィンガリング設定をjson形式のメール本文で送ることができるので、これを利用して、フィンガーリングのjsonデータを入手することができる。(本来、開発者にjson定義を送ることが目的だが、送付先を変更できるので、これを自分自身のメールアドレスに変更する)  
このjsonデータをpythonスクリプトで見やすいフィンガリングチャートに変換する。  
\# なお、フィンガーリングはマニュアルに載っていない

参照：   
[https://shop.recorderinstruments.co.jp/](https://shop.recorderinstruments.co.jp/)  

製品自身はMIDIコントローラで音源を内蔵していないので以下のアプリをインストールして音源として利用する。  
[re.corder ARTinoise Designed for iPad](https://apps.apple.com/us/app/re-corder/id1537534586)  
[owner’s manual re.corder](http://www.artinoise.com/wp-content/uploads/2021/02/artinoise-recorder-manual-ENG-v10.pdf)  

[re.corderUpdate](https://apps.apple.com/us/app/re-corderupdate/id1547273775)   


## フィンガリングチャートに変換するスクプリト

dumpFingeringJson.py
```python

# dump fingering chart for re.corder 2022/10/17

import json
import pprint

# jsonファイルを必要に応じて変更する
#jsonFingering = open('baroque.json','r')
jsonFingering = open('EVI.json', 'r')
#jsonFingering = open('SimonsTrumpet.json', 'r')
#jsonFingering = open('DWhisle.json', 'r')
#jsonFingering = open('custom1.json', 'r')
#jsonFingering = open('custom2.json', 'r')

f = json.load(jsonFingering)

#pprint.pprint(f)

NAME = f['name']
print(NAME,':')
for ff in f['position']:
  if ff[0]['holes']!=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]:
    print(ff[0]['name'])
    H = ff[0]['holes']
    #print('(',H[0],')',H[1],H[2],H[3],'|',H[4],H[5],'[',H[6],H[7],'] [',H[8],H[9],']')
    L0 = int((H[8]+H[9])/2)
    L1 = int((H[6]+H[7])/2)
    print('(',H[0],')',H[1],H[2],H[3],'|',H[4],H[5],L1,L0)

```

実行例：
```

python dumpFingeringJson.py > EVI.log 

xxx.logがフィンガリングチャートになる。


```

以下、実際のフィンガリングチャートになる：

## baroque
re.corderの標準的なフィンガリング  
数字の2はclose, 1はhalf close, 0はopenになる。  
２つ穴のものも１つの数字で表し、上の意味になる。  
左側が左手、右側が右手のチャートになる。  
```
Baroque :
C5
( 2 ) 2 2 2 | 2 2 2 2
C#5
( 2 ) 2 2 2 | 2 2 2 1
D5
( 2 ) 2 2 2 | 2 2 2 0
D#5
( 2 ) 2 2 2 | 2 2 1 0
E5
( 2 ) 2 2 2 | 2 2 0 0
F5
( 2 ) 2 2 2 | 2 0 2 0
F#5
( 2 ) 2 2 2 | 0 2 2 0
G5
( 2 ) 2 2 2 | 0 0 0 0
G#5
( 2 ) 2 2 0 | 2 2 2 0
A5
( 2 ) 2 2 0 | 0 0 0 0
A#5
( 2 ) 2 0 2 | 2 0 0 0
B5
( 2 ) 2 0 0 | 0 0 0 0
C6
( 2 ) 0 2 0 | 0 0 0 0
C#6
( 0 ) 2 2 0 | 0 0 0 0
D6
( 0 ) 0 2 0 | 0 0 0 0
D#6
( 0 ) 0 2 2 | 2 2 2 0
E6
( 1 ) 2 2 2 | 2 2 0 0
F6
( 1 ) 2 2 2 | 2 0 2 0
F#6
( 1 ) 2 2 2 | 0 2 0 0
G6
( 1 ) 2 2 2 | 0 0 0 0
G#6
( 1 ) 2 2 0 | 2 0 0 0
A6
( 1 ) 2 2 0 | 0 0 0 0
A#6
( 1 ) 2 2 0 | 2 2 2 0
B6
( 1 ) 2 2 0 | 2 2 0 0
C7
( 1 ) 2 0 0 | 2 2 0 0
C#7
( 1 ) 2 0 2 | 2 0 2 2
D7
( 1 ) 2 0 2 | 2 0 2 0
D#7
( 1 ) 0 0 2 | 2 0 2 2
E7
( 1 ) 2 2 0 | 0 0 0 2
F7
( 1 ) 2 2 0 | 2 0 0 2
F#7
( 1 ) 2 2 0 | 0 2 0 2
G7
( 1 ) 2 0 2 | 0 0 0 2
G#7
( 1 ) 0 0 2 | 0 0 0 2
A7
( 1 ) 0 2 2 | 2 2 0 2
A#7
( 1 ) 0 2 2 | 2 0 0 2
B7
( 1 ) 0 2 2 | 0 0 0 2
C8
( 1 ) 0 2 0 | 0 0 0 2
```

## EVI
AkaiのEWIでのEVIフィンガリングをベースにしたもの。  
オクターブローラーがないので、左の親指がオクターブ制御になる。

```
Matt's EVI Official :
C5
( 2 ) 2 2 2 | 2 2 2 2
C#5
( 2 ) 2 2 2 | 2 2 2 0
D5
( 2 ) 2 2 2 | 2 0 2 0
D#5
( 2 ) 2 2 2 | 0 2 2 0
E5
( 2 ) 2 2 2 | 2 2 0 0
F5
( 2 ) 2 2 2 | 2 0 0 0
F#5
( 2 ) 2 2 2 | 0 2 0 0
G5
( 2 ) 2 2 2 | 0 0 0 0
G#5
( 2 ) 0 2 2 | 0 2 2 0
A5
( 2 ) 0 2 2 | 2 2 0 0
A#5
( 2 ) 0 2 2 | 2 0 0 0
B5
( 2 ) 0 2 2 | 0 2 0 0
C6
( 2 ) 0 2 2 | 0 0 0 0
C#6
( 1 ) 2 2 2 | 2 2 2 0
D6
( 1 ) 2 2 2 | 2 0 2 0
D#6
( 1 ) 2 2 2 | 0 2 2 0
E6
( 1 ) 2 2 2 | 2 2 0 0
F6
( 1 ) 2 2 2 | 2 0 0 0
F#6
( 1 ) 2 2 2 | 0 2 0 0
G6
( 1 ) 2 2 2 | 0 0 0 0
G#6
( 1 ) 0 2 2 | 0 2 2 0
A6
( 1 ) 0 2 2 | 2 2 0 0
A#6
( 1 ) 0 2 2 | 2 0 0 0
B6
( 1 ) 0 2 2 | 0 2 0 0
C7
( 1 ) 0 2 2 | 0 0 0 0
C#7
( 0 ) 2 2 2 | 2 2 2 0
D7
( 0 ) 2 2 2 | 2 0 2 0
D#7
( 0 ) 2 2 2 | 0 2 2 0
E7
( 0 ) 2 2 2 | 2 2 0 0
F7
( 0 ) 2 2 2 | 2 0 0 0
F#7
( 0 ) 2 2 2 | 0 2 0 0
G7
( 0 ) 2 2 2 | 0 0 0 0
G#7
( 0 ) 0 2 2 | 0 2 2 0
A7
( 0 ) 0 2 2 | 2 2 0 0
A#7
( 0 ) 0 2 2 | 2 0 0 0
B7
( 0 ) 0 2 2 | 0 2 0 0
C8
( 0 ) 0 2 2 | 0 0 0 0
C#8
( 0 ) 0 2 0 | 0 0 0 0

```
## 参考情報

フィンガリングチャート：  
[Fingering_Chart_for_Soprano_Recorder.pdf](https://americanrecorder.org/docs/Fingering_Chart_for_Soprano_Recorder.pdf)  
[Grifftabelle_EWI5000.pdf](https://www.ewi-player.ch/images/Documents/EWI5000/Grifftabelle_EWI5000.pdf)  
[エレフエ取扱説明書(フィンガリングあり)](https://www.fineassist.jp/archives/001/202206/e5ed957067e077a6532b88f481769057.pdf)  


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

