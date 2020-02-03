# CRITr -Communities Resolving Issues Together


CRITr is a webapp created using the django framework using mapping services provided by [ESRI's](https://developers.arcgis.com/javascript/) javascript API. Its purpose is to allow community groups such as [StreetWatch](http://street-watch.org/) to coordinate patrols and report information back to the police more effectively to aid in crime detection and prevention.


## N.B 
To run the code on a server use the command:
    `supervisord -c supervisord.conf`

To run in deployment use the command:
    `./startApp.sh -d`

To run on a server SSL certification is required for ESRI's tracking (used for patrols) to work.
