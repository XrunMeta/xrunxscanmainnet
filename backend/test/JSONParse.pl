use JSON::Parse ':all';
use Unicode::UTF8 'decode_utf8';
my $highbytes = "か";
my $not_utf8 = "$highbytes\\u3042";
my $test = "{\"a\":\"TestTest\",\"a1\":\"TestTes1111t\"}";
my $out = parse_json ($test);

print "JSON::Parse gives this: ", $out->{a}, "\n";
print "JSON::Parse gives this: ", $out->{a1}, "\n";