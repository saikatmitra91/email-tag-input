(function($, window) {
    var userEmails,
        template;

    function init() {
        userEmails = new UserEmails();
        $(document).ready(function() {
            template = new Template();
            bindEvents();
        });
    }

    function bindEvents() {
        $('.email-input').keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which),
                $this = $(this),
                emailPushSuccess = {}
            $inputElem = $('.email-input');
            if (keycode == '13' || keycode == '32') {
                event.preventDefault();
                emailPushSuccess = userEmails.pushEmail($this.text());
                if (emailPushSuccess.success) {
                    template.render(userEmails.fetchEmailList());
                    $this.empty();
                } else {
                    alert(emailPushSuccess.message);
                }
            }

            if (keycode == 8 && !$inputElem.text()) {
                event.preventDefault();

            }
        });

        $('.email-id-wrapper').on('click', function(event) {
            var $target = $(event.target),
                targetData = $target.data();
            if ($target.is('.remove')) {
                userEmails.removeEmail(targetData.email);
                template.render(userEmails.fetchEmailList());
            }
        });
    }

    function UserEmails() {
        var emailList = [],
            emailTestRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.validateEmail = function(email) {
            return emailTestRegex.test(email);
        };
        this.pushEmail = function(email) {
            var emailSuccess = {
                success: false,
                message: ''
            };
            if (this.validateEmail(email)) {
                emailList.push(email);
                emailSuccess.success = true;
            } else {
                emailSuccess.message = "Invalid email address";
            }
            return emailSuccess;
        };

        this.fetchEmailList = function() {
            return emailList;
        };

        this.removeEmail = function(email) {
            var emailIndex = emailList.indexOf(email);
            if (emailIndex > -1) {
                emailList.splice(emailIndex, 1);
            }
        };
    }

    function Template() {
        var template = '<div class="emails"><span>{{emailId}}</span><span data-email="{{emailId}}" class="remove">&#x2715;</span></div>',
            parentClass = ".email-id-wrapper .email-list",
            $parentObj = $(parentClass);
        if (!$parentObj) {
            throw Error("No element for : " + parentClass + " to inject email ids");
        }
        this.render = function(emailIdList) {
            var count = 0,
                html = '';
            while (emailIdList[count]) {
                html += template.replace(/{{emailId}}/g, emailIdList[count]);
                count++;
            }
            $parentObj.html('').append(html);
        };
    }

    init();
})($, window);
