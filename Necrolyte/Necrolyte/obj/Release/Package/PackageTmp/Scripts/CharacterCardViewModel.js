function CharacterCard()
{
    var self = this;

    self.TestValue = 5;
    self.TestValue2 = ko.observable({TestValue3: 5});
    self.Attributes = ko.observable(new EditableCollection(Attribute));
    self.Resources = ko.observable(new EditableCollection(Resource));
    self.Weapons = ko.observable(new EditableCollection(Weapon));
    self.Traits = ko.observable(new EditableCollection(Trait));
    self.CharacterDescription = ko.observable(new CharacterDescription());
    self.EquationTester = ko.observable('');
    self.EquationTesterResults = ko.computed(function ()
    {
        return owenge.equation.parse(self.EquationTester(), self).answer;
    });
    self.Save = function (URL)
    {
        $.fileDownload(URL, {
            httpMethod: "POST",
            data: { JSONData: self.JSON(), fileName: self.CharacterDescription().Name() + ".txt" }
        });
    }
    self.Load = function (data)
    {
        self.Attributes(new EditableCollection(Attribute, data.Attributes));
        self.Resources(new EditableCollection(Resource, data.Resources));
        self.Weapons(new EditableCollection(Weapon, data.Weapons));
        self.Traits(new EditableCollection(Trait, data.Traits));
        self.CharacterDescription(new CharacterDescription(data.CharacterDescription));
    }
    self.JSON = function () 
    { 
        return ko.toJSON(self); 
    };
}
function Attribute(data)
{
    data = data || {};
    var self = this;
    self.Name = ko.observable(data.Name || "Name");
    self.Value = ko.observable(data.Value || 0);
    self.IncreaseValue = function () { self.Value(parseInt(self.Value()) + 1) };
    self.DecreaseValue = function () { self.Value(parseInt(self.Value()) - 1) };
}

function Resource(data)
{
    data = data || {};
    var self = this;
    self.Name = ko.observable(data.Name || "Name");
    self.Value = ko.observable(data.Value || 0);
    self.IncreaseValue = function () { self.Value(self.Value() + 1) };
    self.DecreaseValue = function () { self.Value(self.Value() - 1) };
}

/* Weapon Constructor*/
function Weapon(data)
{
    data = data || {};
    var self = this;

    /* Colleciton Instantiation*/
    self.FireModes = ko.observableArray([]);
    if (typeof (data.FireModes) !== "undefined")
    {
        var arrayMap = ko.utils.arrayMap(data.FireModes, function (fireMode)
        {
            return new FireMode(fireMode);
        });
        self.FireModes(arrayMap);
    }
    if (self.FireModes().length == 0)
    {
        self.FireModes.push(new FireMode());
    }

    self.MagazineTypes = ko.observableArray([]);
    if (typeof (data.MagazineTypes) !== "undefined")
    {
        var arrayMap = ko.utils.arrayMap(data.MagazineTypes, function (magType)
        {
            return new MagazineType(magType);
        });
        self.MagazineTypes(arrayMap);
    }
    if (self.MagazineTypes().length == 0)
    {
        self.MagazineTypes.push(new MagazineType());
    }

    /* Attribute Instantiation*/
    self.ID = ko.observable(data.ID || guid());
    self.Name = ko.observable(data.Name || "Name");
    self.Class = ko.observable(data.Class || "Melee");
    self.Damage = ko.observable(data.Damage || "2d10 + 5");
    self.AdditionalInformation = ko.observable(data.AdditionalInformation || "");
    self.SelectedFireMode = ko.observable(typeof data.SelectedFireModeIndex !== 'undefined' ? self.MagazineTypes()[data.SelectedFireModeIndex] : self.FireModes()[0]);
    self.SelectedMagazineType = ko.observable(typeof data.SelectedMagazineTypeIndex !== 'undefined' ? self.MagazineTypes()[data.SelectedMagazineTypeIndex] : self.MagazineTypes()[0]);
    self.CurrentMagazineType = ko.observable(data.CurrentMagazineType || self.MagazineTypes()[0]);
    self.CurrentMagazine = ko.observable(data.CurrentMagazine || self.SelectedMagazineType().Capacity());

    /* Function Instantiation*/
    self.IncreaseMagazines = function () { self.SelectedMagazineType().Count(self.SelectedMagazineType().Count() + 1) };
    self.DecreaseMagazines = function () { self.SelectedMagazineType().Count(self.SelectedMagazineType().Count() - 1) };
    self.AddFireMode = function ()
    {
        var newMode = new FireMode();
        self.FireModes.push(newMode);
        self.SelectedFireMode(newMode);
    };
    self.RemoveFireMode = function () { self.FireModes.remove(self.SelectedFireMode()) };
    self.AddMagazineType = function ()
    {
        var newType = new MagazineType();
        self.MagazineTypes.push(newType);
        self.SelectedMagazineType(newType);
    };
    self.RemoveMagazineType = function () { self.MagazineTypes.remove(self.SelectedMagazineType()) };
    self.IncreaseCurrentMagazine = function ()
    {
        var newCount = parseInt(self.CurrentMagazine()) + parseInt(self.RateOfFire());
        newCount = newCount > self.SelectedMagazineType().Capacity() ? self.SelectedMagazineType().Capacity() : newCount;
        self.CurrentMagazine(newCount);
    };
    self.DecreaseCurrentMagazine = function ()
    {
        self.CurrentMagazine(self.CurrentMagazine() - self.RateOfFire()); if (self.CurrentMagazine() < 0) self.CurrentMagazine(0);
    };
    self.Reload = function ()
    {
        if (self.SelectedMagazineType().Count() > 0)
        {
            self.DecreaseMagazines();
            self.CurrentMagazineType(self.SelectedMagazineType());
            self.CurrentMagazine(self.CurrentMagazineType().Capacity());
        }
    };
    self.Fire = function ()
    {
        self.CurrentMagazine(self.CurrentMagazine() - self.SelectedFireMode().RateOfFire());
        if (self.CurrentMagazine() < 0)
            self.CurrentMagazine(0);
    };

    /* Functions for Exporting and Importing from JSON*/
    self.SelectedMagazineTypeIndex = ko.computed(function () { self.MagazineTypes().indexOf(self.SelectedMagazineType()) });
    self.SelectedFireModeIndex = ko.computed(function () { self.FireModes().indexOf(self.SelectedFireMode()) });
}
function FireMode(data)
{
    data = data || {};
    var self = this;
    self.Name = ko.observable(data.Name || "Default");
    self.RateOfFire = ko.observable(data.RateOfFire || 3);
}
function MagazineType(data)
{
    data = data || {};
    var self = this;
    self.Name = ko.observable(data.Name || "Default");
    self.Capacity = ko.observable(data.RateOfFire || 60);
    self.Count = ko.observable(data.RateOfFire  || 1);
}

function Trait(data)
{
    data = data || {};
    var self = this;
    self.Name = ko.observable(data.Name || "Name");
    self.Value = ko.observable(data.Value || "");
    self.ID = ko.observable(data.ID || guid());
}
function CharacterDescription(data)
{
    data = data || {};
    var self = this;

    self.Name = ko.observable(data.Name || "Unknown");
    self.Speciality = ko.observable(data.Speciality || "Tactical Marine");
    self.Chapter = ko.observable(data.Chapter || "Unknown");
    self.Demeanour = ko.observable(data.Demeanour || "");
    self.Biography = ko.observable(data.Biography || "");
    self.EditMode = ko.observable(data.EditMode || false);

    self.ToggleEditMode = function ()
    {
        self.EditMode(!self.EditMode());
    };
}

