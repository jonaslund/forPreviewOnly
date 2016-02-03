# For Preview Only

All of the ‘For Preview Only’ copies of all the works in the Lima Collection collected and compressed to a 24 hours long video, presented here with time based synchronised playback. 

lima.js explains the scraping of all the videos, step by step.

# A programmer's solution to video art or the commandline's power for repetetive tasks

Step by Step

1. Get index of all works.
    – Analyse website and find a way to get the whole catalogue.

2. Download all works
    – WGET to the rescue

3. Speed up all video works
    – FFMPEG

4. Unify all video works
5. Concat into one video file
6. Build front end of website that synchronises the playback based on the clock
6. Realise that one video file's headers are too large – split into 24 parts
    ffmpeg -i forPreviewOnly-new.mp4 -acodec copy -f segment -segment_time 3600 -vcodec copy -reset_timestamps 1 -map 0 -an %d.mp4

7. Upload to AWS S3
8. Build front end of website that synchronises the playback based on the clock
9. Realise that we need captions
10. Figure out how to find each position of each video by calculating its length
11. Stream captions via websockets
12. DONE.
13. (Make local version for the screening)


## supported by (www.li-ma.nl/site/article/lima-collection-2015)(lima collection) and the stimuleringsfonds