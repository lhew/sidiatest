define(function(){

/**
 * Conjunto de funções utilitárias
 *
 * @Class Utils
 */
var Utils = {};


	
    var channelURL = "http://gdata.youtube.com/feeds/api/users/",
        beforeData = "/uploads/?q=&alt=json";


    Utils.channelFunctions = {
	    /**
		 * Retorna a url do canal a ser pesquisado
		 *
		 * @method seachChannel
		 * @param {String} channel - Canal a ser pesquisado.
		 * @return {String} url do canal
		 */
        searchChannel : function(channel){
            return channelURL + channel + beforeData;
        }
    };


	/**
	* Redimensiona o embed do vídeo de acordo com um contexto
	*
	* @method resizeVideos
	* @param {Object} iframes - objeto jquery do iframe a ser redimensionado
	* @param {Object} context - objeto jquery do contexto ao qual o iframe será redimensionado
	*/
    Utils.resizeVideos = function(iframes, context){
    	var $allVideos = iframes,

		    $fluidEl = context;

			$allVideos.each(function() {

			$(this).data('aspectRatio', this.height / this.width).removeAttr('height').removeAttr('width');

			});

		$(window).off('resize').on('resize', function() {

			var newWidth = $fluidEl.width();
			
			$allVideos.each(function() {

				var $el = $(this);
				$el.width(newWidth).height(newWidth * $el.data('aspectRatio'));

			});

		}).resize();
    }

	/**
	* Exibe o modal com conteúdos passados na assinatura do método
	*
	* @method showModal
	* @param {Object} modal - objeto jquery do Modal
	* @param {String} title - Título do modal
	* @param {String} content - Conteúdo do modal
	*/

    Utils.showModal = function(modal, title, content){

        if(
            (typeof(title) == "string" && title.length > 0) &&
            (typeof(content) == "string" && content.length > 0)
        ){

            modal.find(".modal-title").text(title);
            modal.modal("show").find(".modal-body").html(content);

        }else{
            throw new Error("Verifique se todos os parâmetros enviados são do tipo string");
        }

    };

    /**
	* Retorna o ID de um vídeo do Youtube
	*
	* @method getVideoID
	* @param {String} videoURL - URL do vídeo
	* @returns {String} parte da URL contendo o ID do vídeo
	*/
    Utils.getVideoID = function(videoURL){
        var video_id = videoURL.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    },

    /**
	* Carrega os templates a serem usados no projeto
	*
	* @method requestPartials
	* @param {String} partialsFile - URL do arquivo contendo templates
	* @returns {function} Callback de tratamento
	*/
    Utils.requestPartials = function(partialsFile, fn){
        $.ajax({
            url : partialsFile,
            success : fn
        })
    }

    return Utils;

})