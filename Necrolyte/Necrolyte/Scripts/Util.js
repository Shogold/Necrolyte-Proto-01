
function S4()
{
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid()
{
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function CheckDefined(valueToCheck, defaultValue)
{
    return typeof valueToCheck !== 'undefined' ? valueToCheck : defaultValue;
}
function isFunction(functionToCheck)
{
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function EditableCollection(constructor, data)
{
    data = data || {};
    var self = this;

    self.Constructor = constructor;

    self.Collection = ko.observableArray([]);
    if (typeof (data.Collection) !== "undefined")
    {
        var arrayMap = ko.utils.arrayMap(data.Collection, function (attr)
        {
            return new self.Constructor(attr);
        });
        self.Collection(arrayMap);
    }

    self.EditMode = ko.observable(data.EditMode || false);

    self.Add = function () { self.Collection.push(new self.Constructor()) };
    self.Remove = function (ele) { self.Collection.remove(ele) };
    self.ToggleEditMode = function ()
    {
        self.EditMode(!self.EditMode())
    };
}

