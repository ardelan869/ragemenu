local UPDATE_RESOURCE = '^3A new update is avaible for the ragemenu (%s). You can download it here: %s^0';
local BASE_URL        = 'https://api.github.com/repos/ardelan869/ragemenu/releases/latest';
local RESOURCE_NAME   = GetCurrentResourceName();
local CURRENT_VERSION = GetResourceMetadata(RESOURCE_NAME, 'version', 0);

if not CURRENT_VERSION then
  return print('^1Could not find the version for ' .. RESOURCE_NAME .. '!^0');
end

PerformHttpRequest(BASE_URL, function(status, body)
  if status ~= 200 or not body then
    return print('^1An error occured, while checking the version. You can ignore this error message.^0');
  end

  local release = json.decode(body);

  if release.prelease then
    return print('^3This is a prelease, expect errors to occur.^0');
  end

  local LATEST_VERSION = release.tag_name;

  if LATEST_VERSION ~= CURRENT_VERSION then
    return print(UPDATE_RESOURCE:format(RESOURCE_NAME, release.html_url));
  end
end);
