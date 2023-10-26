    
# RaspberryPi4のSSD/SD性能測定  

2023/10/26  
SDでの測定結果の追加  

2023/10/14+      
初版    
  
## 概要 
「Argon One M.2」の内蔵SSDとSSD内蔵USBメモリの性能を測定する。

測定するハードウェアの型番：
1. 「Argon One M.2」の内蔵SSD  
[WDS500G3B0B [WD Blue SA510シリーズ SATA接続 M.2 SSD 500GB]](https://www.yodobashi.com/product/100000001007168243/?kad1=1&utm_medium=cpc&utm_source=kakaku&utm_term=WDS500G3B0B+%5BWD+Blue+SA510%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA+SATA%E6%8E%A5%E7%B6%9A+M.2+SSD+500GB%5D&xfr=kad)  
2. SSD内蔵USBメモリ    
[ESD-EXS0250GBK [SSD 外付け 250GB USB3.2 Gen1]](https://www.yodobashi.com/product/100000001008041380/)  


## 測定方法

以下のコマンドで測定する：  
```

#書き込み測定
dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync

#読み込み測定
sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
dd if=/tmp/tempfile of=/dev/null bs=1M count=1024

#シャットダウン
sudo shutdown -h now 

```

## 結果

「Argon One M.2」の内蔵SSD測定結果：  
```
WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 6.33218 s, 170 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
$ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 3.15488 s, 340 MB/s

```

(「Argon One M.2」に刺した)SSD内蔵USBメモリ測定結果1：  
```

WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 7.72552 s, 139 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
$ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 3.65686 s, 294 MB/s

```

(従来ケースに刺した)SSD内蔵USBメモリ測定結果2：  
```

WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 6.57727 s, 163 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
$ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 2.78997 s, 385 MB/s

```

## [参考]SDでの測定結果(RaspberryPi4)  

SDその１
```
WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 50.0323 s, 21.5 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
$ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 24.5313 s, 43.8 MB/s
```

SDその２
```
WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 59.2803 s, 18.1 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
xshige@sd2:~ $ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 26.4189 s, 40.6 MB/s
```
RaspberryPi4の場合、(10)以上であればSDの速さで大きく差が出ることはないようだ。

## [参考]SDでの測定結果(RaspberryPi Zero2)

SDその１
```

WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 122.166 s, 8.8 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
$ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 46.0671 s, 23.3 MB/s
```

SDその２
```
WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 58.2476 s, 18.4 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
$ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 45.446 s, 23.6 MB/s

```
Zero2においてSDの速さの違いは、WRITEの速さの違いになって表れるようだ。  
また、Pi4とZero2の違いは、READの速さの違いとして表れ、２倍くらいの差になるようだ。


## [参考]pc-linuxでの測定結果
```

WRITE:
$ dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
1024+0 レコード入力
1024+0 レコード出力
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 5.1437 s, 209 MB/s

READ:
$ sudo sh -c "/usr/bin/echo 3 > /proc/sys/vm/drop_caches"
$ dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
1024+0 レコード入力
1024+0 レコード出力
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 0.783031 s, 1.4 GB/s

```

## 考察  
「Argon One M.2」内蔵SSDとSSD内蔵USBメモリの性能差は、それほどないのでコストパフォーマンスを考慮すると通常ケースが使えるSSD内蔵USBメモリのほうが良いと思われる。(SSD内蔵USBメモリは、まだ価格が高いが、これから安くなると期待できる) 

## 参照  
[Testing Disk Performance on Linux](https://www.baeldung.com/linux/disk-performance-test)   
[ArgonONE_m.2のSSDにOSを書き込む](https://xshigee.github.io/web0/md/RSPI_ArgonOne_m.2.html)   

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

