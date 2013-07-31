
var initalDieTemplates = [new CreateDieTemplate(4, 1, "d4"), new CreateDieTemplate(5, 1, "d5"), new CreateDieTemplate(6, 1, "d6"), new CreateDieTemplate(10, 1, "d10"), new CreateDieTemplate(20, 1, "d20"), new CreateDieTemplate(100, 1, "d100")];

function CreateDiceView()
{
    var self = this;

    self.DiceBags = ko.observableArray([]);
    self.DieTemplates = ko.observableArray(initalDieTemplates);
    self.SelectedDieTemplateForEditing = ko.observable(self.DieTemplates()[0]);
    self.CreateNewDieBag = function ()
    {
        self.DiceBags.push(new CreateDieBag({}));
        $(".ColorPicker").minicolors();
    };
    self.Remove = function (ele) { self.DiceBags.remove(ele) };
    self.CreateNewDieTemplate = function ()
    {
        var NewTemp = new CreateDieTemplate(6, 1, "New Die Template");
        self.DieTemplates.push(NewTemp);
        self.SelectedDieTemplateForEditing(NewTemp);
    };
    self.RemoveDieTemplate = function ()
    {
        var index = self.DieTemplates.indexOf(self.SelectedDieTemplateForEditing());
        self.DieTemplates.splice(index, 1);
        if (self.DieTemplates.length > 0)
            self.SelectedDieTemplateForEditing(self.DieTemplates[0]);
    };
    self.Save = function (URL)
    {
        $.ajax({
            type: "POST",
            url: URL,
            data: { JSONData: ko.toJSON({ Bags: self.DiceBags }), fileName: "Dice.txt" }
        }).done(function ()
        {
            window.location = URL;
        });
    };
    self.Load = function (data)
    {
        var arrayMap = ko.utils.arrayMap(data.Bags, function (dieBagData)
        {
            return new CreateDieBag(dieBagData);
        });
        self.DiceBags(arrayMap);
    };
}
function CreateDieTemplate(maxValue, minValue, name, bgColor)
{
    var self = this;
    self.MaxValue = ko.observable(typeof maxValue !== 'undefined' ? maxValue : 6);
    self.MinValue = ko.observable(typeof minValue !== 'undefined' ? minValue : 1);
    self.Name = ko.observable(typeof name !== 'undefined' ? name : "New Template");
    self.BGColor = ko.observable(typeof maxValue !== 'undefined' ? bgColor : "");
    self.CreateDieData = function ()
    {
        var data =
        {
            MaxValue: self.MaxValue(),
            MinValue: self.MinValue(),
            Value: self.MinValue(),
            BGColor: self.BGColor(),
            IsSelected: true
        };
        return data;
    }
}
function CreateDie(data)
{
    this.MaxValue = ko.observable(CheckDefined(data.MaxValue, 6));
    this.MinValue = ko.observable(CheckDefined(data.MinValue, 1));
    this.Value = ko.observable(CheckDefined(data.Value, this.MinValue()));
    this.IsSelected = ko.observable(CheckDefined(data.IsSelected, this.true));
    this.BGColor = ko.observable(CheckDefined(data.BGColor, ""));
    this.ToggleSelection = function ()
    {
        this.IsSelected(!this.IsSelected())
    };
    this.Roll = function ()
    {
        this.Value(parseInt(Math.floor(Math.random() * (this.MaxValue() - this.MinValue() + 1)) + parseInt(this.MinValue())));
    };
}
function RecreateDieSet(data)
{
    var diceAsObservableObjects = [];
    $(data).each(function () { diceAsObservableObjects.push(new CreateDie(this)) });
    return diceAsObservableObjects;
}
function CreateDieBag(data)
{
    var self = this;
    self.Dice = ko.observableArray(typeof data.Dice !== 'undefined' ?
    ko.utils.arrayMap(data.Dice, function (dieData)
    {
        return new CreateDie(dieData);
    }) : []);
    self.IsEditMode = ko.observable(CheckDefined(data.IsEditMode, false));
    self.GUID = ko.observable(CheckDefined(data.GUID, guid()));
    self.Name = ko.observable(CheckDefined(data.Name, "New Die Bag"));
    self.BGColor = ko.observable(CheckDefined(data.BGColor, ""));
    self.SelectedDieTemplate = ko.observable(initalDieTemplates[0]);
    self.DiceTotal = ko.computed(function ()
    {
        var total = 0;
        for (var i = 0; i < self.Dice().length; i++)
            total += self.Dice()[i].Value();
        return total;
    }, self);
    self.ToggleEditMode = function ()
    {
        self.IsEditMode(!self.IsEditMode())
    };
    self.RollDice = function ()
    {
        ko.utils.arrayForEach(self.Dice(), function (die) { if (die.IsSelected()) { die.Roll() } });
        self.Dice.sort(function (left, right) { return left.Value() == right.Value() ? 0 : (left.Value() < right.Value() ? 1 : -1) });
    };
    self.AddDie = function ()
    {
        self.Dice.push(new CreateDie(self.SelectedDieTemplate().CreateDieData()));
    };
    self.DeleteDie = function (die)
    {
        self.Dice.remove(die);
    };
    return self;
}
$(document).ready(function ()
{
    CurrentViewModel = new CreateDiceView();
    ko.applyBindings(CurrentViewModel);
    $('form').ajaxForm(function (data)
    {
        CurrentViewModel.Load(data);
    });
});