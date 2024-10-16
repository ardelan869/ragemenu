RESOURCE_NAME = 'ragemenu';
LAST_RESOURCE = nil;

local AUDIOS = {
  OnSelect = {
    name = 'NAV_UP_DOWN',
    ref = 'HUD_FREEMODE_SOUNDSET'
  },
  OnChange = {
    name = 'NAV_LEFT_RIGHT',
    ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET'
  },
  OnCheck = {
    name = 'NAV_LEFT_RIGHT',
    ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET'
  },
  OnClick = {
    name = 'SELECT',
    ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET',
  },
  Exit = {
    name = 'BACK',
    ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET'
  }
};

exports('SendNUIMessage', function(message)
  local resource = GetInvokingResource();

  if not resource then
    return;
  end

  LAST_RESOURCE = resource;

  SendNUIMessage(message);
end);

exports('SetNuiFocus', SetNuiFocus);
exports('SetNuiFocusKeepInput', SetNuiFocusKeepInput);

for _, callback in next, {
  'OnSelect',
  'OnChange',
  'OnCheck',
  'OnClick',
  'Exit'
} do
  RegisterNUICallback(callback, function(req, resp)
    if not req.menu.resource then
      return resp('OK');
    end

    local import <const> = exports[req.menu.resource];

    if not import then
      return resp('OK');
    end

    if callback == 'Exit' then
      LAST_RESOURCE = nil;
    end

    import:Emit(callback, req);

    local audio = AUDIOS[callback];

    PlaySoundFrontend(-1, audio.name, audio.ref, true)

    resp('OK');
  end);
end

AddEventHandler('onResourceStop', function(resource)
  if LAST_RESOURCE == resource then
    SendNUIMessage({ action = 'SetMenu' });
    SendNUIMessage({ action = 'SetItems' });
  end
end);
