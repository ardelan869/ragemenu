# ragemenu

FiveM native Rage Menu, built with React. [Documentation](https://docs.ardelanyamanel.com/ragemenu)

## Dependencies

-   [Sumneko LLS for VSCode](https://marketplace.visualstudio.com/items?itemName=sumneko.lua)

## Features

-   High-performance script
-   Cached component and menu state
-   Runtime-editable menus and components
-   Fully typed

## Installation

1. Download the [latest release](https://github.com/ardelan869/ragemenu/releases/latest) from GitHub.

2. Extract the contents of the zip file into your `resources` folder.

3. Add the path of `meta.lua` to your [Sumneko LLS](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) `workspace.library` setting.

4. Add `ensure ragemenu` to your `server.cfg`.

5. Add `@ragemenu/import.lua` to your desired resources `fxmanifest.lua` and start scripting!

## Example

> [!NOTE]
> The menu offers more components and functions.\
> See more [here](https://docs.ardelanyamanel.com/ragemenu)

```lua
--- you can create a menu once and reopen it at any time
--- state will be cached and reused
local menu = Menu:Create('Example', 'Example Subtitle', nil, nil, '')
-- 520 is a custom width, the default is
local submenu = Menu:Create('Submenu', 'Submenu Subtitle', 520)
submenu:AddButton('Submenu Button'):OnClick(function()
  print('Submenu Button Clicked')
end)

menu:AddButton('Button', 'Button Right Label', 'Button Description'):OnClick(function()
  print('Button Clicked')
end)

menu:AddSubmenu(submenu, 'Submenu Label', 'Right Label', 'Submenu Description')

menu:AddSeparator('Separator')

local checkbox = menu:AddCheckbox('Checkbox', 'Checkbox Description', {
  right = 'card_suit_hearts'
}, true)

checkbox:OnCheck(function(checked)
  print('Checkbox Checked', checked)
end)

menu:AddButton('Disable Checkbox'):OnClick(function()
  checkbox:Disable(not checkbox.disabled)
  print('Checkbox Disabled', checkbox.disabled)
end)

menu:AddButton('Toggle Checkbox Visibility'):OnClick(function()
  checkbox:ToggleVisiblity(not checkbox.visible)
  print('Checkbox Visibility', checkbox.visible)
end)

menu:AddList('List', 'List Description', {
  right = 'card_suit_hearts'
}, {
  'List Item 1',
  'List Item 2',
  'List Item 3'
}, 1):OnChange(function(current, currentValue)
  print('List Changed', current, currentValue)
end)

menu:AddSlider('Slider', 'Slider Description', {
  right = 'card_suit_hearts'
}, 100, 0, 10, 50):OnChange(function(current)
  print('Slider Changed', current)
end)

RegisterCommand('example', function()
  if menu:IsOpen() then
    menu:Close()
  else
    menu:Open()
  end
end, false)
```
