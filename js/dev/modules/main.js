define(["utils"],function(Utils){


	/**
	 * Classe que trata UI e rotinas de busca
	 *
	 * @Class ChannelsSearch
	 */
    var ChannelsSearch = function(){

        var self = this;
        var partials;
        var videosSwiper;
        var $myModal = $("#myModal"),
        	$searchInput = $("#searchInput"),
        	$searchButton = $("#searchButton"),
        	$closeModal = $(".closemodal"),
        	$modalBody = $("#modal-body")


	    /**
		 * Busca vídeo e preenche o carrossel caso existe um canal.
		 * Senão, mostra um modal indicando o erro.
		 *
		 * @method searchChannel
		 * @param {String} channel - Canal a ser pesquisado.
		 * @return {Void}
		 */
        this.onSearchChannel = function(channel){

            if(typeof(channel) == "string" && channel.length > 0 ){
                    

                Utils.showModal($myModal, "Pesquisar Canal", "Pesquisando vídeos no canal <strong>"  + channel +  "</strong>");

                $.ajax({
                    url : Utils.channelFunctions.searchChannel(channel),
                    success : function(e){
                        
                    if(!e.feed.entry){
                        Utils.showModal($myModal, "Aviso", "Não existem vídeos no canal <strong>" + channel +  "</strong>. O nome do canal está correto?");
                    }else{
                        
                        videosSwiper.removeAllSlides() 

                        for(var i in e.feed.entry){

                            var item = e.feed.entry[i];
                            var context = {
                                img : item.media$group.media$thumbnail[0].url,
                                title : item.title.$t,
                                video_link : Utils.getVideoID(item.link[0].href)
                            }

                            var templateSource = $(partials)[0].innerHTML;
                            var template = Handlebars.compile(templateSource);
                            var newSlide = videosSwiper.createSlide(template(context));

                            newSlide.append();
                        }


                        $("button.watch").on('click', function(){
                            
                            var parent = $(this).parent();

                            var context = {
                                title : parent.find("h2").text(),
                                video_link : $(this).attr('data-video')
                            }

                            var templateSource = $(partials)[2].innerHTML;
                            var template = Handlebars.compile(templateSource);

                            self.watchVideo(template(context));
                        });

                        setTimeout(function(){
                            $myModal.modal('hide');
                        },500);
                    }

                    },error : function(e){
                        
                        var context = {
                                status : e.status,
                                statusText : e.statusText,
                                responseText : e.responseText
                            }

                        var templateSource = $(partials)[4].innerHTML;
                        var template = Handlebars.compile(templateSource);

                        Utils.showModal($myModal, "Erro", template(context));
                    }
                });
            }else{
                Utils.showModal($myModal, "Aviso", "Digite o nome de um canal do youtube");
            }
        }

        this.watchVideo = function(content){

            if(typeof(content) == "string" && content.length > 0){
                Utils.showModal($myModal, "Vídeo", content);
                Utils.resizeVideos($("#youtube-frame"),$modalBody);
            }

        }

	    /**
		 * Inicia o módulo.
		 * @method init
		 * @return {Void}
		 */
        this.init = function(){

        	videosSwiper = new Swiper("#swiper");

            Utils.requestPartials("partials.html", function(e){
                partials = e;
            });

            $searchButton.on('click', function(){
                self.onSearchChannel($searchInput.val());
            });
 
            $searchInput.on('focus', function(){
                $searchButton.attr('data-content', '').popover('hide');
            });

            $closeModal.on('click', function(){
            	$modalBody.html('');
            })

        }
    }

    
    $(function(){
        var c = new ChannelsSearch();
        c.init();
    })
});