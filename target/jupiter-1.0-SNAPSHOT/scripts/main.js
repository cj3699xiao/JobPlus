//;()()  // add infront of ;, to ensure pack up correct
(function () { // this is field protection, like encapsulation
    // dom elements
    var oAvatar = document.getElementById('avatar'),  // o is object , normally use class, id is only for data update
        oWelcomeMsg = document.getElementById('welcome-msg'),
        oLogoutBtn = document.getElementById('logout-link'),
        oRegisterFormBtn = document.getElementById('register-form-btn'),
        oLoginBtn = document.getElementById('login-btn'),
        oLoginForm = document.getElementById('login-form'),
        oLoginUsername = document.getElementById('username'), //  get from input field
        oLoginPwd = document.getElementById('password'), // get from input field
        oLoginFormBtn = document.getElementById('login-form-btn'),
        oLoginErrorField = document.getElementById('login-error'), // to display error

        oRegisterBtn = document.getElementById('register-btn'),
        oRegisterUsername = document.getElementById('register-username'),
        oRegisterPwd = document.getElementById('register-password'),
        oRegisterFirstName = document.getElementById('register-first-name'),
        oRegisterLastName = document.getElementById('register-last-name'),
        oRegisterForm = document.getElementById('register-form'),
        oRegisterResultField = document.getElementById('register-result'), // all register field

        oNearbyBtn = document.getElementById('nearby-btn'),
        oFavBtn = document.getElementById('fav-btn'),
        oRecommendBtn = document.getElementById('recommend-btn'),
        oNavBtnList = document.getElementsByClassName('main-nav-btn'), // get three buttons
        // need one favor buttons
        oItemNav = document.getElementById('item-nav'), // where to display items
        oItemList = document.getElementById('item-list'),

        oTpl = document.getElementById('tpl').innerHTML,
        userId = '1111', // these are default
        userFullName = 'John',
        lng = -122.08,
        lat = 37.38,
        itemArr;


    function init(){
        // console.log("WTF");
        // validation session  -> after ajax
        validateSession();
        // to show login form

        // bind events
        bindEvent();
    }

    function validateSession() {
        // show login form
        switchLoginRegister('login');
        // hide rest
    }

    function bindEvent(){
        oRegisterFormBtn.addEventListener('click' ,function () {
            // console.log("asdasdasd");
            switchLoginRegister('registration')
        }, false);

        oLoginFormBtn.addEventListener('click', function() {
            switchLoginRegister('login')
        }, false);

        // click login
        oLoginBtn.addEventListener('click', loginExecutor, false);

        oRegisterBtn.addEventListener('click', registerExecutor, false);
        oNearbyBtn.addEventListener('click', loadNearbyData, false);
        oFavBtn.addEventListener('click', loadFavoriteItems, false);
        oRecommendBtn.addEventListener('click', loadRecommendedItems, false);

        //click item btn  :  to change favorite or not
        oItemList.addEventListener('click', changeFavoriteItems, false);
    }

    function showOrHideElement(ele, style) {
        // css -> display :   none will hide, block will show(in thsi case)
        ele.style.display = style;
    }

    function switchLoginRegister(name) {
        // hide header
        showOrHideElement(oAvatar, 'none');
        showOrHideElement(oWelcomeMsg, 'none');
        showOrHideElement(oLogoutBtn, 'none');

        // hide item list
        showOrHideElement(oItemNav, 'none');
        showOrHideElement(oItemList, 'none');

        // case 1: name == login
        if(name === 'login') {
            // hide register
            showOrHideElement(oRegisterForm, 'none');
            // clear register error
            oRegisterResultField.innerHTML = '';
            // show login
            showOrHideElement(oLoginForm, 'block');
        } else {
            // case 2: name == registration
            // hide login form
            showOrHideElement(oLoginForm, 'none');
            // clear login error if existed
            oLoginErrorField.innerHTML = '';

            // show register form
            showOrHideElement(oRegisterForm, 'block');
        }
    }



    function loginExecutor() {
        var username = oLoginUsername.value,
            password = oLoginPwd.value;

        if(username === '' || password === '') {
            oLoginErrorField.innerHTML = "Please enter something, do not let them empty!";
            return;
        }

        password = window.md5(username + window.md5(password));
        // md5 imported in index.html
        // will define the md5 function after run (like callback)

        ajax({
            method:'POST',
            url:'./login',
            data: {
                user_id:username,
                password: password
            },
            success: function(res) {
                // case 1 login success is 200
                if(res.status === 'OK') { //feed back is ok
                    // console.log('login');
                    // console.log(res);

                    //show welcome msg
                    welcomMsg(res);

                    //fetch data
                    fetchData();
                // } else {
                }
                // else if(res.status === 'Login failed, user id and passcode do not exist.') {
                //     //case 2: login failed is not 200
                //     oLoginErrorField.innerHTML = 'Invalid username or password!'
                // }
            },
            error: function() {
                //show login error
                // oLoginErrorField.innerHTML = 'Invalid username or password!';
                throw new Error('The request could not be completed.');
            }
        })
    }

    function changeFavoriteItems(evt) {
        // evt.target will find the element that invoke this method
        // this evt parameter, is pass by browser !!
        var tar = evt.target,
            // this will print whatever we click, (child level)
            oParent = tar.parentElement;
        // evt.parent will get parent, .target will get the child which invoke the event
        // . operation is expensive, save them!!!!

        if(oParent && oParent.className === 'fav-link') {
            // find li
            var oCurLi = oParent.parentElement,
                // this will get the whole array of list (all jobs)
                classname = tar.className,
                isFavorite = classname === 'fa fa-heart' ? true : false,
                oItems = oItemList.getElementsByClassName('item'),
                // will get the array of current job (an array of a job  )

                // arr.indexOf(3)  -> will return index of the element or -1 as not find
                index = Array.prototype.indexOf.call(oItems, oCurLi),
                // here, we don't have indexOf method for OItems
                // Array.prototype.indexOf ->  this will get the method indexOf
                // .call will 'borrow this method'
                // Then we pass into  (total array, to find)

                url = './history',
                req = {
                    user_id: userId,
                    favorite: itemArr[index]
                };
            var method = !isFavorite ? 'POST' : 'DELETE';

            // console.log(index);
            //call server to set or unset fav item

            ajax({
                method: method,
                url: url,
                data: req,
                success: function (res) {
                    //get response success
                    if (res.status === 'OK' || res.result === 'SUCCESS') {
                        // case 1 success
                        tar.className = !isFavorite ? 'fa fa-heart' : 'fa fa-heart-o';
                        // fa fa-heart is fontawesome !!  imported by index.html  L9
                       //  https://fontawesome.com/icons?d=gallery&m=free

                            } else {
                        // case 2 fail
                        throw new Error('Change Favorite failed!')
                    }
                },
                error: function () {
                    // case didn't send/receive correctly
                    throw new Error('Change Favorite failed!')
                }
            })

        }
        // console.log(tar, oParent);
    }

    function fetchData() {
        //geolocation
        initGeo(loadNearbyData);
    }

    function registerExecutor() {
        var username = oRegisterUsername.value,
            password = oRegisterPwd.value,
            firstName = oRegisterFirstName.value,
            lastName = oRegisterLastName.value;

        if (username === "" || password == "" || firstName === ""
            || lastName === "") {
            oRegisterResultField.innerHTML = 'Please fill in all fields';
            return;
        }

        if (username.match(/^[a-z0-9_]+$/) === null) {
            oRegisterResultField.innerHTML = 'Invalid username';
            return;
        }
        password = md5(username + md5(password));

        ajax({
            method: 'POST',
            url: './register',
            data: {
                user_id : username,
                password : password,
                first_name : firstName,
                last_name : lastName,
            },
            success: function (res) {
                // res is from back-end !!
                if (res.status === 'OK' || res.result === 'OK') {
                    oRegisterResultField.innerHTML = 'Successfully registered!'
                } else {
                    oRegisterResultField.innerHTML = 'User already existed!'
                }
            },
            error: function () {
                //show login error
                throw new Error('Failed to register');
            }
        })
    }

    function loadNearbyData() {
        activeBtn('nearby-btn');
        // oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i>Loading ' + opt.message + ' item...</p>';

        var opt = {
            method: 'GET',
            url: './search?user_id=' + userId + '&lat=' + lat + '&lon=' + lng,
            data: null,
            message: 'nearby'
        }
        //fetch data
        serverExecutor(opt);

    }

    function loadFavoriteItems() {
        activeBtn('fav-btn');
        oItemList.innerText = ''
        var opt = {
            method: 'GET',
            url: './history?user_id=' + userId,
            data: null,
            message: 'favorite'
        }
        serverExecutor(opt);
        // above line is method that doing the same as below

        // ajax({
        //     method: 'GET',
        //     url: './history?user_id=' + userId,
        //     data: null,
        //     message: 'favorite',
        //     success: function (res) {
        //         //case1: fail, res empty or length is 0
        //         if (!res || res.length === 0) {
        //             oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i>No favorite item!</p>';
        //         } else {
        //             //case2 success
        //             render(res);
        //             itemArr = res;
        //         }
        //
        //     },
        //     error: function () {
        //         throw new Error('Load Favorite Failed!');
        //     }
        // })
    }


    function loadRecommendedItems() {
        activeBtn('recommend-btn');
        var opt = {
            method: 'GET',
            url: './recommendation?user_id=' + userId + '&lat=' + lat + '&lon=' + lng,
            data: null,
            message: 'recommended'
        }
        serverExecutor(opt);
    }


    function serverExecutor(opt) {
        oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i>Loading ' + opt.message + ' item...</p>';
        ajax({
            method: opt.method,
            url:opt.url,
            data: opt.data,
            success: function(res) {
                // console.log(res);
                //case 1 null or empty
                if(!res || res.length === 0) {
                    oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i>No ' + opt.message + ' item!</p>';
                } else {
                    //case 2: dataset is not empty
                    render(res);
                    itemArr = res;
                }

            },
            error: function() {
                throw new Error('No nearby data!' + opt.message);
            }

        })
    }

    function render(data) {
        // My solution
        // if(data === "no matches") {
        //     oItemList.innerHTML = "No thing matches!";
        //     return;
        // }

        var len = data.length,
            list = '',
            item;
        // use regular expression to find our target, and replace them with our data.
        for (var i = 0; i < len; i++) {
            item = data[i];
            list += oTpl.replace(/{{(.*?)}}/gmi, function (node, key) {
                console.log(key)
                if(key === 'company_logo') {
                    return item[key] || 'https://via.placeholder.com/100';
                }
                if (key === 'location') {
                    return item[key].replace(/,/g, '<br/>').replace(/\"/g, '');
                }
                if (key === 'favorite') {
                    return item[key] ? "fa fa-heart" : "fa fa-heart-o";
                }
                return item[key];
            })
        }
        oItemList.innerHTML = list;
    }

    function activeBtn(btnId) {
        var len = oNavBtnList.length;
        for (var i = 0; i < len; i++) {
            //remove active
            oNavBtnList[i].className = 'main-nav-btn';
        }
        // only add active to one we select
        var btn = document.getElementById(btnId);
        btn.className += ' active';
    }
    // here, call back to ensure we have position var

    function initGeo(cb) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( function(position) {
                // console.log(position);
                // lat = position.coords.latitude || lat;
                // lng = position.coords.longitude || lng;
                // test case
                // lng = -122;
                // lat = 47;
                lng=-74.0060;
                lat=40.7128;
                cb();
            },function() {
                throw new Error('Geo location fetch failed !!');
            }, {
                maximumAge:60000
            });
            oItemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i>Retrieving your location...</p>';
        } else {
            throw new Error('Your browser does not support navigator!!');
        }
    }

    function welcomMsg(msg) {
        userId = msg.user_id || userId; // if no, get default
        userFullName = msg.name || userFullName;
        oWelcomeMsg.innerHTML = 'Welcome ' + userFullName;

        // show welcome, avatar, item area, logout btn
        showOrHideElement(oWelcomeMsg, 'block');
        showOrHideElement(oAvatar, 'block');
        showOrHideElement(oItemNav, 'block');
        showOrHideElement(oItemList, 'block');
        showOrHideElement(oLogoutBtn, 'block');

        // hide login form
        showOrHideElement(oLoginForm, 'none');
    }



    // AJAX helper  ,  communicate with back-end
    function ajax(opt) {
        var opt = opt || {},     // if no input, opt as null
            method = (opt.method || 'GET').toUpperCase(),
            url = opt.url,
            data = opt.data || null,
            success = opt.success || function() {},
            error = opt.error || function() {},
            // step 1 create ajax obj
            xhr = new XMLHttpRequest();

        //error checking
        if(!url) {
            throw new Error('where is your url, bro?');
        }

        //step 2 configuration
        xhr.open(method, url, true);
        //step 3 send
        if(!data) {
            xhr.send();
        } else {
            xhr.setRequestHeader('Content-type', 'application/jason;charset=utf-8');
            xhr.send(JSON.stringify(data));
        }

        // step 4 listener
        // case 1 success
        xhr.onload = function() {
            if(xhr.status === 200) {
                // success to send and receive; and status is 200
                success(JSON.parse(xhr.responseText));
            } else {
                if(xhr.status === 401) {
                    oLoginErrorField.innerHTML = 'Invalid username or password!';  // for login password & username no match, 401 -> unauthorized
                }
                // success to send and receive; and status is not 200
                error();
            }


        }
        //case 2 fail to send and receive
        xhr.onerror = function() {
            error();
            // throw new Error('The request could not be completed.');
        }
    }

    // entry fn  --- init fn
    init();
    // data manager : get from database

})();
// all function

// switch login / register
// login + register api
// data from server
// render data -- template
// near favorite recommendation
// change favorite



