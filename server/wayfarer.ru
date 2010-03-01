require 'wayfarer'

use Rack::ShowExceptions
use Rack::Static, :urls => ["/script", "/client"]
run Wayfarer::Server.new