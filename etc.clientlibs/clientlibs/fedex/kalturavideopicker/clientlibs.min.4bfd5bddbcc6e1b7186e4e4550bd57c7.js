/**
 * @author Mavice LLC
 **/
;(function($, win, mK) {

    mK.setInitHandler('[data-mavice-kaltura-simple-player]', init);

    /////////////

    function init(components) {
        
        if (components.length === 0) {
            return;
        }

        components.each(function () {
            
            var $cnt = $(this);

            var hasData = $cnt.data('mavice-kpinit');
            
            if (hasData || hasData === 'true') {
                
                if (typeof mK.playerInstanceIds === 'undefined' || mK.playerInstanceIds === null) {
                    mK.playerInstanceIds = [];
                }
                
                var videoId = $cnt.data('mavice-kp-videoid'),
                    partnerId = $cnt.data('mavice-kp-partnerid'),
                    playerId = $cnt.data('mavice-kp-playerid'),
                    playerToken = $cnt.data('mavice-kp-playertoken'),
                    autoPlay = $cnt.data('mavice-kp-autoplay'),
                    thumbnail = $cnt.data('mavice-kp-thumbnail'),
                    playerInstanceId = $cnt.find('.mavice-kp-player').attr('id'),
                    kpRef = null;
                    
                console.log("playerInstanceId : " + playerInstanceId);
                // setting failover image if given image cannot be loaded
                if (thumbnail) {
                    var failOverImg = new Image();
                    failOverImg.src = thumbnail;
					failOverImg.addEventListener('load', function() {
                        // embed with given thumbnail
                        embed();
                        });
                    failOverImg.addEventListener('error', function() {  
                        // embed with placeholder thumbnail
                        thumbnail = '/content/dam/fedex-com/images/default-image/image-placeholder.jpg';
                        embed();
                    });
                }


                if (playerInstanceId === '' || playerInstanceId === 'mavice-kaltura-vp') {
                    console.log("***** Making Player Id Unique *****");
                    playerInstanceId = 'mavice-kaltura-vp_' + mK.playerInstanceIds.length;
                    $cnt.find('.mavice-kp-player').attr('id', playerInstanceId);
                }
                
                console.log("playerInstanceId : " + playerInstanceId);
                
                mK.playerInstanceIds.push(playerInstanceId);
                
                function kpReady(playerId) {
                    console.log("***** Player Ready *****");
                    console.log("Player Id: " + playerId);
                    kpRef = document.getElementById(playerId);
                    kpRef.kBind("playerStateChange", function( state, id ){
                        // state = the player's current state
                        // id = the ID of the player that fired the notification
                        console.log("player state changed ");
                        console.log("id : " + id);
                        console.log("state : " + state);
                        if (state === "playing") {
                            pauseOtherPlayers(id);
                        }
                    });
                }

                function pauseOtherPlayers(currentId) {
                    console.log("pausing all players except " + currentId);
                    for (var i = 0; i < mK.playerInstanceIds.length; i ++) {
                        var pid = mK.playerInstanceIds[i];
                        if (pid !== currentId) {
                            var kp = document.getElementById(pid);
                            kp.sendNotification('doPause');
                        }
                    }
                }

                function embed(){
                    kWidget.embed({
                        "targetId": playerInstanceId,
                        "wid": partnerId,
                        "uiconf_id": playerId,
                        "flashvars": {
                            "autoPlay": autoPlay,
                            "thumbnailUrl": thumbnail,
                            "ks": playerToken
                        },
                        "cache_st": 1548871668,
                        "entry_id": videoId,
                        "readyCallback": kpReady
                    });
                }

            }

        });
    }
})(jQuery, window, mavice.kaltura);