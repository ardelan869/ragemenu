# ragemenu

FiveM native Rage Menu, built with React.

## Dependencies

-   [Sumneko LLS for VSCode](https://marketplace.visualstudio.com/items?itemName=sumneko.lua)

## Features

-   High-performance script
-   Cached component and menu state
-   Runtime-editable menus and components
-   Fully typed

## Installation

1. Download the [latest release](https://github.com/ardelan869/ragemenu/releases/latest) from GitHub.

2. Extract the contents of the zip file into your `resources` folder and remove `-main` from the folder name.

3. Add the path of `meta.lua` to your [Sumneko LLS](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) `workspace.library` setting.

4. Add `ensure ragemenu` to your `server.cfg`.

## Example

> [!NOTE]
> The menu offers more components and functions.\
> DOCUMENTATION COMING SOON.

```lua
--- you can create a menu once and reopen it at any time
--- state will be cached and reused
local menu = Menu:Create('Example', 'Example Subtitle')

local exampleButton = menu:AddButton('Example Button', 'Example Description', {
  left = 'shop_ammo_icon'
})

exampleButton:OnClick(function(component)
  print(component.label .. ' Clicked!')
end)

local exampleSlider = menu:AddSlider('Example Slider', 'Example Description', nil, 100, 0, 10, 50)

local removeSliderHandler = exampleSlider:OnChange(function(current)
  print('current slider progress', current)
end)

exampleSlider:OnClick(function()
  removeSliderHandler() -- this function removes the OnChange handler, that's above

  print('Removed slider `OnChange` handler')
end)

RegisterCommand('example', function()
  if menu:IsOpen() then
    menu:Close()
  else
    menu:Open()
  end
end, false)
```
