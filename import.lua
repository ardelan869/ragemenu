if IsDuplicityVersion() then
  error('This resource is client-side only.', 0);
end

if Menu then
  error('Menu already exists, ensure that you are not loading this resource twice.', 0);
end

---@return string
local function generateUUID()
  local uuid = string.gsub('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', '[xy]', function(c)
    local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb);

    return string.format('%x', v);
  end);

  return uuid;
end

local import = exports.ragemenu;

---@param message any
local function SendNUIMessage(message)
  import:SendNUIMessage(message);
end

---@param hasFocus boolean
---@param hasCursor boolean
local function SetNuiFocus(hasFocus, hasCursor)
  import:SetNuiFocus(hasFocus, hasCursor);
end

---@param keepInput boolean
local function SetNuiFocusKeepInput(keepInput)
  import:SetNuiFocusKeepInput(keepInput);
end

---@class MenuClass
Menu = {
  __cached = {},
  opened = {},
  current = nil
};

function Menu:GetById(id)
  for _, menu in next, self.__cached do
    if menu.id == id then
      return menu;
    end
  end
end

function Menu:GetOpened()
  if self.current then
    return self:GetById(self.current);
  end
end

local function resetNUI()
  SetNuiFocus(false, false);
  SetNuiFocusKeepInput(false);

  SendNUIMessage({ action = 'SetMenu' });
  SendNUIMessage({ action = 'SetItems' });
end

---@param menu Menu
function Menu:Open(menu)
  if self.current == menu.id then
    return;
  end

  -- get the menu again just in case, anything wasn't updated correctly
  menu = self:GetById(menu.id) --[[@as Menu]];

  if not menu then
    return self:CloseAll();
  end

  for index, menuId in next, self.opened do
    if menuId == menu.id then
      table.remove(self.opened, index);
    end
  end

  self.opened[#self.opened + 1] = menu.id;
  self.current = menu.id;

  SetNuiFocus(true, false);
  SetNuiFocusKeepInput(true);

  SendNUIMessage({
    action = 'SetMenu',
    data = menu:toJSON()
  });

  SendNUIMessage({
    action = 'SetItems',
    data = menu:componentsToJSON()
  });
end

function Menu:Close()
  if #self.opened == 0 then
    return self:CloseAll();
  end

  for index, menuId in next, self.opened do
    if menuId == self.current then
      table.remove(self.opened, index);
    end
  end

  local lastOpened = self:GetById(self.opened[#self.opened]);

  if not lastOpened then
    return self:CloseAll();
  end

  if lastOpened then
    self:Open(lastOpened);
  end
end

function Menu:CloseAll()
  if not self.current then
    return;
  end

  self.opened = {};
  self.current = nil;

  resetNUI();
end

function Menu:Create(menuTitle, menuSubtitle, menuWidth, maxVisibleItems, banner)
  ---@class Menu
  local menu = {
    id = generateUUID(),
    resource = GetCurrentResourceName(),
    title = menuTitle,
    subtitle = menuSubtitle,
    width = menuWidth,
    maxVisibleItems = maxVisibleItems,
    banner = banner,
    __components = {}
  };

  function menu:set(key, value)
    if key == 'id' then
      error('Cannot set id of menu', 0);
    end

    if key == 'resource' then
      error('Cannot set resource of menu', 0);
    end

    self[key] = value;

    if Menu.current == self.id then
      SendNUIMessage({
        action = 'UpdateMenu',
        data = { [key] = value }
      });
    end
  end

  function menu:SetTitle(title)
    self:set('title', title);
  end

  function menu:SetSubtitle(subtitle)
    self:set('subtitle', subtitle);
  end

  function menu:RemoveComponent(id)
    for index, component in next, self.__components do
      if component.id == id then
        table.remove(self.__components, index);

        SendNUIMessage({
          action = 'RemoveItem',
          data = id
        });

        break;
      end
    end
  end

  function menu:addComponent(type, label, rightLabel, description, badges, disabled, values, checked, current, iconStyle,
                             max, min, step)
    ---@type MenuComponent
    local component = {
      id = generateUUID(),
      type = type,
      label = label,
      rightLabel = rightLabel,
      description = description,
      badges = badges,
      disabled = disabled,
      visible = true,
      values = values,
      checked = checked,
      current = current,
      iconStyle = iconStyle,
      max = max,
      min = min,
      step = step,
      __events = {}
    };

    function component:set(key, value)
      if key == 'type' then
        error('Cannot set type of component', 0);
      end

      if key == 'id' then
        error('Cannot set id of component', 0);
      end

      self[key] = value;

      if Menu.current == menu.id then
        SendNUIMessage({
          action = 'UpdateItem',
          data = {
            id = self.id,
            [key] = value
          }
        });
      end
    end

    function component:SetLabel(label)
      self:set('label', label);
    end

    function component:SetDescription(description)
      self:set('description', description);
    end

    function component:SetBadges(badges)
      self:set('badges', badges);
    end

    function component:on(event, func)
      if not self.__events[event] then
        self.__events[event] = {};
      end

      self.__events[event][#self.__events[event] + 1] = func;

      return function()
        for _, eventFunc in next, self.__events[event] do
          if eventFunc == func then
            table.remove(self.__events[event], _);
          end
        end
      end
    end

    function component:trigger(event, ...)
      local args = { ... };

      if not self.__events[event] then
        return;
      end

      for _, func in next, self.__events[event] do
        Citizen.CreateThreadNow(function(threadId)
          func(table.unpack(args));

          if threadId and IsThreadActive(threadId) then
            TerminateThread(threadId);
          end
        end);
      end
    end

    if component.type == 'checkbox' then
      function component:SetChecked(checked)
        self:set('checked', checked);
      end

      function component:SetIconStyle(iconStyle)
        self:set('iconStyle', iconStyle);
      end

      function component:OnCheck(func)
        return self:on('check', func);
      end
    end

    if component.type == 'list' then
      function component:SetValues(values)
        self:set('values', values);
      end
    end

    if component.type == 'slider' then
      function component:SetMax(max)
        self:set('max', max);
      end

      function component:SetMin(min)
        self:set('min', min);
      end

      function component:SetStep(step)
        self:set('step', step);
      end
    end

    if component.type == 'list' or component.type == 'slider' then
      function component:SetCurrent(current)
        self:set('current', current);
      end

      function component:OnChange(func)
        return self:on('change', func);
      end
    end

    if component.type ~= 'separator' then
      function component:OnClick(func)
        return self:on('click', func);
      end

      function component:Disable(disable)
        self:set('disabled', disable);
      end

      function component:SetRightLabel(rightLabel)
        self:set('rightLabel', rightLabel);
      end

      function component:OnSelect(func)
        return self:on('select', func);
      end
    end

    function component:ToggleVisiblity(visible)
      self:set('visible', visible);
    end

    function component:Remove()
      menu:RemoveComponent(self.id);
    end

    function component:toJSON()
      return {
        id = self.id,
        type = self.type,
        label = self.label,
        rightLabel = self.rightLabel,
        description = self.description,
        badges = self.badges,
        disabled = self.disabled,
        visible = self.visible,
        values = self.values,
        checked = self.checked,
        current = self.current,
        iconStyle = self.iconStyle,
        max = self.max,
        min = self.min,
        step = self.step
      };
    end

    menu.__components[#menu.__components + 1] = component;

    if menu:IsOpen() then
      SendNUIMessage({
        action = 'AddItem',
        data = component:toJSON()
      });
    end

    return component;
  end

  function menu:AddButton(label, rightLabel, description, badges, disabled)
    return self:addComponent('button', label, rightLabel, description, badges, disabled);
  end

  function menu:AddSubmenu(submenu, label, rightLabel, description, badges, disabled)
    if not badges or not badges.right then
      badges = {
        left = badges and badges.left or nil,
        right = 'arrowright'
      };
    end

    local button = self:AddButton(label, rightLabel, description, badges --[[@as { left?: BadgeName; right: BadgeName }]],
      disabled);

    button:OnClick(function()
      local subMenu = Menu:GetById(type(submenu) == 'string' and submenu or submenu.id);

      if not subMenu then
        return;
      end

      subMenu:Open();
    end);

    return button;
  end

  function menu:AddSeparator(label, badges)
    return self:addComponent('separator', label, nil, nil, badges);
  end

  function menu:AddCheckbox(label, description, badges, checked, iconStyle, disabled)
    return self:addComponent('checkbox', label, nil, description, badges, disabled, nil, checked, nil, iconStyle);
  end

  function menu:AddList(label, description, badges, values, current, disabled)
    return self:addComponent('list', label, nil, description, badges, disabled, values, nil,
      current and math.min(current - 1, 0) or 0);
  end

  function menu:AddSlider(label, description, badges, max, min, step, current, disabled)
    return self:addComponent('slider', label, nil, description, badges, disabled, nil, nil, current or 0, nil, max,
      min, step);
  end

  function menu:Open()
    return Menu:Open(self);
  end

  function menu:Close()
    if Menu.current == self.id then
      Menu:Close();
    end
  end

  function menu:IsOpen()
    return Menu.current == self.id;
  end

  function menu:toJSON()
    return {
      id = self.id,
      resource = self.resource,
      title = self.title,
      subtitle = self.subtitle,
      width = self.width,
      maxVisibleItems = self.maxVisibleItems,
      banner = self.banner
    };
  end

  function menu:componentsToJSON()
    local components = {};

    for _, component in next, self.__components do
      components[#components + 1] = component:toJSON();
    end

    return components;
  end

  function menu:getComponentById(id)
    for _, component in next, self.__components do
      if component.id == id then
        return component;
      end
    end
  end

  self.__cached[#self.__cached + 1] = menu;

  return menu;
end

---@param callback 'OnSelect' | 'OnChange' | 'OnCheck' | 'OnClick' | 'Exit'
---@param req CallbackRequest
exports('Emit', function(callback, req)
  local menu = Menu:GetById(req.menu.id);

  if not menu then
    return;
  end

  local component = menu:getComponentById(req.selected);

  if callback == 'OnSelect' and component then
    component:trigger('select', component);
  elseif callback == 'OnChange' and component then
    component.current = req.current;

    if component.type == 'list' then
      component:trigger('change', component, req.current + 1, component.values[req.current + 1]);
    elseif component.type == 'slider' then
      component:trigger('change', component, req.current);
    end
  elseif callback == 'OnCheck' and component then
    component.checked = req.checked;
    component:trigger('check', component, req.checked);
  elseif callback == 'OnClick' and component then
    component:trigger('click', component);
  elseif callback == 'Exit' then
    menu:Close();
  end
end);
