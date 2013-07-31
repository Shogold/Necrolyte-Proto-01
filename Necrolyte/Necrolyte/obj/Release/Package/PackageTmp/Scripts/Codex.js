function Codex(data)
{
    data = data || {};
    var self = this;
    self.Traits = ko.observable(new EditableCollection(Trait));

    self.Save = function (URL)
    {
        $.fileDownload(URL, {
            httpMethod: "POST",
            data: { JSONData: self.JSON(), fileName: "Codex.txt" }
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