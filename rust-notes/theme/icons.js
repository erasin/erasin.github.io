$( document ).ready(function() {
    $('a').each(function(element) {
        var link = $(this);
        switch (link.text()) {
            case "github":
                link.html('<i class="fa fa-github"></i>');
                break;
            case "doc":
                link.html('<i class="fa fa-book"></i>');
                break;
            case "site":
                link.html('<i class="fa fa-home"></i>');
                break;
            case "crate":
                link.html('<i class="fa fa-cubes"></i>');
                break;
            case "git":
                link.html('<i class="fa fa-git"></i>');
                break;

            default:
                break;
        }
    });
});
