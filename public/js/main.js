$(document).ready(function(){

    $('.ajax-delete').on("click", function(){
        const postId = $(this).attr('data-id');
        
        $.ajax({
            type: 'DELETE',
            url: '/articles/delete/' + postId,
            success: function(response) {
                console.log("Deleting Article"); 
                window.location.href = '/'; 
            },
            error: function(error) {
                console.log(error); 
            }
        })

    })


})