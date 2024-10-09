-- The only purpose of this file is to add types for the sumneko.lua extension

---@meta

---@class CallbackRequest
---@field menu { id: string; resource: string; title: string; subtitle?: string }
---@field selected? string
---@field checked? boolean
---@field current? number

---@alias BadgeName
--- | 'card_suit_clubs'
--- | 'card_suit_diamonds'
--- | 'card_suit_hearts'
--- | 'card_suit_spades'
--- | 'medal_bronze'
--- | 'medal_gold'
--- | 'medal_silver'
--- | 'mp_alerttriangle'
--- | 'mp_hostcrown'
--- | 'mp_medal_bronze'
--- | 'mp_medal_gold'
--- | 'mp_medal_silver'
--- | 'mp_specitem_cash'
--- | 'mp_specitem_coke'
--- | 'mp_specitem_heroin'
--- | 'mp_specitem_meth'
--- | 'mp_specitem_weed'
--- | 'shop_ammo_icon'
--- | 'shop_armour_icon'
--- | 'shop_art_icon'
--- | 'shop_barber_icon'
--- | 'shop_chips'
--- | 'shop_clothing_icon'
--- | 'shop_franklin_icon'
--- | 'shop_garage_bike_icon'
--- | 'shop_garage_icon'
--- | 'shop_gunclub_icon'
--- | 'shop_health_icon'
--- | 'shop_lock'
--- | 'shop_lock_arena'
--- | 'shop_makeup_icon'
--- | 'shop_mask_icon'
--- | 'shop_michael_icon'
--- | 'shop_new_star'
--- | 'shop_tattoos_icon'
--- | 'shop_tick_icon'
--- | 'shop_trevor_icon'

---@alias MenuType 'button' | 'checkbox' | 'separator' | 'list' | 'slider'

---@class MenuComponentData
---@field id string
---@field type MenuType
---@field label string
---@field description? string
---@field badges? { left?: BadgeName; right?: BadgeName }
---@field disabled? boolean
---@field values? string[]
---@field checked? boolean
---@field current? number
---@field iconStyle? 'cross' | 'tick'
---@field max? number
---@field min? number

---@class MenuComponentBase:MenuComponentData
---@field __events table<string, fun(...: any)[]>
---@field on fun(self: self, event: string, func: fun(...: any)): fun()
---@field trigger fun(self: self, event: string, ...: any)
---@field set fun(self: self, key: string, value: any)
---@field OnSelect fun(self: self, func: fun(component: MenuComponent)): fun()
---@field OnClick fun(self: self, func: fun(component: MenuComponent)): fun()
---@field SetLabel fun(self: self, label: string)
---@field SetRightLabel fun(self: self, rightLabel: string)
---@field SetDescription fun(self: self, description: string)
---@field SetBadges fun(self: self, badges: { left?: BadgeName; right?: BadgeName })
---@field Disable fun(self: self, disable: boolean)
---@field ToggleVisiblity fun(self: self, visible: boolean)
---@field Remove fun(self: self)
---@field toJSON fun(self: self): MenuComponentData

---@class CheckboxComponent:MenuComponentBase
---@field type 'checkbox'
---@field checked boolean
---@field iconStyle? 'cross' | 'tick'
---@field OnClick nil
---@field OnCheck fun(self: self, func: fun(checked: boolean)): fun()
---@field SetChecked fun(self: self, checked: boolean)
---@field SetIconStyle fun(self: self, iconStyle: 'cross' | 'tick')

---@class ListComponent:MenuComponentBase
---@field type 'list'
---@field values string[]
---@field current number
---@field OnChange fun(self: self, func: fun(current: number, currentValue: string)): fun()
---@field SetValues fun(self: self, values: string[])
---@field SetCurrent fun(self: self, current: number)

---@class SliderComponent:MenuComponentBase
---@field type 'slider'
---@field current number
---@field max number
---@field min? number
---@field step? number
---@field OnChange fun(self: self, func: fun(current: number)): fun()
---@field SetCurrent fun(self: self, current: number)
---@field SetMax fun(self: self, max: number)
---@field SetMin fun(self: self, min: number)
---@field SetStep fun(self: self, step: number)

---@class SeparatorComponent:MenuComponentBase
---@field type 'separator'
---@field OnClick nil
---@field OnSelect nil
---@field Disable nil
---@field SetRightLabel nil

---@class MenuComponent:MenuComponentBase, CheckboxComponent, ListComponent, SliderComponent, SeparatorComponent

---@class MenuData
---@field id string
---@field resource string
---@field title string
---@field subtitle? string
---@field width? number
---@field maxVisibleItems? number

---@class Menu:MenuData
---@field __components MenuComponent[]
---@field set fun(self: self, key: string, value: any)
---@field SetTitle fun(self: self, title: string)
---@field SetSubtitle fun(self: self, subtitle: string)
---@field RemoveComponent fun(self: self, id: string)
---@field addComponent fun(self: self, type: MenuType, label: string, rightLabel?: string, description?: string, badges?: { left?: BadgeName; right?: BadgeName }, disabled?: boolean, values?: string[], checked?: boolean, current?: number, iconStyle?: 'cross' | 'tick', max?: number, min?: number, step?: number): MenuComponent
---@field AddButton fun(self: self, label: string, rightLabel?: string, description?: string, badges?: { left?: BadgeName; right?: BadgeName }, disabled?: boolean): MenuComponentBase
---@field AddSubmenu fun(self: self, submenu: Menu | { id: string } | string, label: string, rightLabel?: string, description?: string, badges?: { left?: BadgeName; right?: BadgeName }, disabled?: boolean): MenuComponentBase
---@field AddSeparator fun(self: self, label: string, rightLabel?: string, badges?: { left?: BadgeName; right?: BadgeName }): SeparatorComponent
---@field AddCheckbox fun(self: self, label: string, rightLabel?: string, description?: string, badges?: { left?: BadgeName; right?: BadgeName }, checked?: boolean, iconStyle?: 'cross' | 'tick', disabled?: boolean): CheckboxComponent
---@field AddList fun(self: self, label: string, rightLabel?: string, description?: string, badges?: { left?: BadgeName; right?: BadgeName }, values: string[], current?: number, disabled?: boolean): ListComponent
---@field AddSlider fun(self: self, label: string, rightLabel?: string, description?: string, badges?: { left?: BadgeName; right?: BadgeName }, max: number, min?: number, step?: number, current?: number, disabled?: boolean): SliderComponent
---@field Open fun(self: self)
---@field Close fun(self: self)
---@field IsOpen fun(self: self): boolean
---@field toJSON fun(self: self): MenuData
---@field getComponentById fun(self: self, id: string): MenuComponent?
---@field componentsToJSON fun(self: self): MenuComponentData[]

---@class MenuClass
---@field __cached Menu[]
---@field current? string
---@field opened string[]
---@field Create fun(self: self, title: string, subtitle?: string, width?: number, maxVisibleItems?: number): Menu
---@field GetById fun(self: self, id: string): Menu?
---@field GetOpened fun(self: self): Menu?
---@field Open fun(self: self, menu: Menu)
---@field Close fun(self: self)
---@field CloseAll fun(self: self)

---@class MenuClass
Menu = {};
