use Expect;
use Switch;
use Net::MySQL;
# # use Net::Address::IP::Loc
# use Switch;
# print ("DB try...\n");
my $mysql = Net::MySQL->new( 
    hostname => 'database-jakarta-instance-1.cxm4wpmtypu5.ap-southeast-3.rds.amazonaws.com',
	database => 'TestDB',
	port 	 => '3306',
    user     => 'admin',
    password => 'YDAHVBPNSLZT'
);
# # print $mysql,"\n";
eval {
$query = "SELECT * FROM TestDB.Mem11111111111111111bers";
# $query = "SELECT address FROM Wallets where  CONVERT(AES_DECRYPT(unhex(pin), 'xrun') using utf8) = 'xrun123' and member = 42";
# $query = "SELECT member,email,pin FROM TestDB.Members where pin = password('xrun123') and id = 'km8596859' limit 1";
# $query = "SELECT * FROM Members where members = 30";
# my $data = 'dbals0@naver.com'; 
# $query = "SELECT * FROM TestDB.Members where pin = password('xrun123') and id = '$data' limit 1;";
# SLECT example
$mysql->query($query);
my $record_set = $mysql->create_record_iterator;
my $result = {
    "code" => 9101,
    "staus" =>"Not Match Password"
};
if($record_set != 0){
my $record = $record_set->each;
print $record->[email]."\n";
print $record->[1]."\n";
print $record->[2]."\n";
}
@myArr = ();
while (my $record = $record_set->each) {
    printf "First column: %s Next column: %s\n",
        $record->[0], $record->[1];
    my $result = {
        "member" => $record->[0],
        "timestamp" =>$record->[1],
        "id" =>$record->[2],
        "email" =>$record->[4],
        "mobile" =>$record->[5],
    };
    push @myArr,$result;
}
print "Elements of arr1 are:\n";
foreach $myArr1 (@myArr)
{
    print "$myArr1->{member} \n";
    print "$myArr1->{email} \n";
    print "$myArr1->{mobile} \n";
    print "===================endPoint===================\n";
}

} or do {
    my $e = $@;
    print("Something went wrong: $e\n");
};

    # printf "First column: %s Next column: %s\n",
    #     $record->[pin], $record->[1];
# while (my $record = $record_set->each) {
# }
  


# while () {
#     printf "First column: %s Next column: %s\n",
#         $record->[0], $record->[1];
# }
# # INSERT example
# # $mysql->query(q{
# #     INSERT INTO `TestDB`.`foo` (`id`, `message`) VALUES (2, 'asdasddddddddddddd');
# # });
# print $mysql->get_affected_rows_length,"\n";
#  print int($mysql->has_selected_record()),"\n";
#  if(int($mysql->has_selected_record())){
#      print "asdasd","\n"
#  }
# #  print $mysql->get_field_length();
# $var ="xm2221_request";
# @array = ("xm1021_request","xm2121_request","xm2221_request");
# %hash = ('key1' => "10", 'key2' => 20);

# switch($var){
#    case "a"          { print "字符串 a" }
# #    case [1..10,42]   { print "数字在列表中" }
#    case (\@array)    { print "Test" }
#    case (\%hash)     { print "在哈希中" }
#    else              { print "没有匹配的条件" }
# }
# print "getTransactionList\n";
# sub test{
#     my $command = Expect->spawn('find /home/ubuntu/geth/data/keystore/ -name "*ce19cd96ffc51806cbef3ccee576d7ab296cadc1"'); 
#     my $timeout = 10;
#     unless( $command->expect($timeout, -re => ' ' )){
#         print "====result====\n"
#     }
#     if($command->log_stdout){
#         return $command->before();
#     }
# }

# my $a = &test();

# open( fileHandle,$a ) || die "Cannot open /home/ubuntu/geth/log/transaction_node.txt\n";
# my $count = 0;
# my $line;
# while(<fileHandle>) {
#     $line = $_;
# }
# print "\n";
# print $line."\n";
# close(fileHandle); # 다 읽었으니 꼭 닫습니다. !!!!!
