package Web3;
use Expect;
my $command;
my $timeout;
# geth 커넥션 
sub connectionGeth {
    $command = Expect->spawn("geth attach http://172.31.22.103:5006\r"); 
    $timeout = 10;
    unless( $command->expect($timeout, -re => '[#>\$] $' )){
        print ("expect delay too looose");
    }
}

# 최신 블록 조회
sub getLatestBlock {
    &connectionGeth;
    print $command "JSON.stringify(eth.getBlock(eth.blockNumber));\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("eth.getBlock");
    }
    if($command->log_stdout){
        print ("==========command->after() result==========\n");
        print $command->after();
        print ("==========command->before() result==========\n");
        my $data = $command->before();
        my @arr =  split(";",$data);
        my $count = @arr;
        return @arr[1];
    }
}

#  블록 리스트 조회
# @parameter limit  @parameter offset
sub getBlockList {
    ($limit , $offset) = @_;
    &connectionGeth;
    if($offset != ""){
        print $command "JSON.stringify(Array(".$limit.").fill().map((v,i)=>eth.getBlock(".$offset."-i)));\r";
    }else{
        print $command "JSON.stringify(Array(".$limit.").fill().map((v,i)=>eth.getBlock(eth.blockNumber-i)));\r";
    }
    unless( $command->expect($timeout, -re => '> ' )){
        print ("command complete");
    }
    if($command->log_stdout){
        my $data = $command->before();
        my @arr =  split(";",$data);
        $joinJsonData = join "",@arr[1];
        $joinJsonData =~ s/^\s+|\s+$//g;
        print($joinJsonData);
        return $joinJsonData;
    }
}



# 트랜잭션 리스트(블록 조회후 트랜잭션이 존재한 블럭만 리스팅)
# @parameter limit @parameter offset
sub getBlockByTransactionHashList {
    ($limit , $offset) = @_;
    &connectionGeth;
    if(!$limit){
        print "limit 매개변수가 필요합니다";
        return;
    }
    !$offset ?  $offset = "eth.blockNumber" : $offset;  
    print $command "transacationList = [];\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("find >>[]");
    }
    print $command  "bn = $offset;\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("command complete");
    }

    print $command "while(transacationList.length <= $limit ){
    findBlock =  eth.getBlock(bn);
    console.log(findBlock.transactions.length ,findBlock.number );
    console.log('transacationList.length',typeof transacationList.length)
    console.log('Number($limit)',typeof Number($limit))
    console.log('transacationList.length === Number($limit)',transacationList.length === Number($limit))
    if(findBlock && findBlock.transactions.length !== 0 ){
            transacationList.push(...findBlock.transactions);
    }
    if(transacationList.length >= Number($limit)){
        console.log(`Find`);
        result = transacationList.map((v)=>eth.getTransaction(v))
        console.log(JSON.stringify(result))
        console.log(`Find List`);
    } 
    bn--;
    }\r";   
    unless( $command->expect($timeout *10, -re => '> ' )){
        print ("command complete\n");
    }
    if($command->log_stdout){
        print "\n";
        my $data = $command->before();
        print "======================log======================\n";
        my @arr =  split("Find List",$data);
        my @jsonData = split("Find",@arr[1]);
        $joinJsonData = join "",@jsonData[1];
        $joinJsonData =~ s/^\s+|\s+$//g;
        return $joinJsonData;
    }

}


#계좌 조회
sub getAccounts {
    &connectionGeth;
    print $command "JSON.stringify(eth.accounts);\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("getAccounts");
    }
    if($command->log_stdout){
        my $data = $command->before();
        return $data;
    }
}
#  단일 트랜잭션
# @parameter TransactionHash
sub getTransaction {
    &connectionGeth;
    ($tx) = @_;
    print $command "JSON.stringify(eth.getTransaction('$tx'));\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("eth.getTransaction");
    }
    if($command->log_stdout){
        my $data = $command->before();
        my @arr =  split(";",$data);
        my $count = @arr;
        return @arr[1];
    }

}
#  단일 블록
# @parameter BlockNumber
sub getBlock {
    &connectionGeth;
     ($bn) = @_;
    print $command "JSON.stringify(eth.getBlock('$bn'));\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("eth.getBlock");
    }
    if($command->log_stdout){
        my $data = $command->before();
        my @arr =  split(";",$data);
        my $count = @arr;
        return @arr[1];
    }
}
#  단일 트랜잭션 조회 token 
# @parameter BlockNumber
sub getTransactionReceipt {
    &connectionGeth;
    ($tx) = @_;
    print $command "JSON.stringify(eth.getTransactionReceipt('$tx'));\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("eth.getTransactionReceipt");
    }
    if($command->log_stdout){
        my $data = $command->before();
        my @arr =  split(";",$data);
        my $count = @arr;
        return @arr[1];
    }
}
# 개인 계좌 트랜잭션 리스트
sub getAccountByTrnanscationList {
    &connectionGeth;
    ($account) = @_;
    $count = 500;
    print $command "var myAddr = '$account';\r";
            unless( $command->expect($timeout, -re => '> ' )){
        print ("var myAddr");
    }
    print $command "let counter = 0 , transactionList = [];\r";
            unless( $command->expect($timeout, -re => '> ' )){
        print ("let counter");
    }
    
    print $command "var currentBlock = eth.blockNumber;\r";
        unless( $command->expect($timeout, -re => '> ' )){
        print ("var currentBlock");
    }
    print $command "while (counter < $count) {
        if (transactionList.length < 10) {
            var block = eth.getBlock(currentBlock);
            if (block && block.transactions) {
            block.transactions.forEach(value => {
                const recepit = eth.getTransactionReceipt(value);
                if (recepit.from === myAddr) {
                transactionList.push(recepit);
                }
            });
            }
            counter++;
            currentBlock--;
        }
  }\r";
    unless( $command->expect($timeout, -re => '> ' )){
        print ("while (counter <");
    }
    print $command "JSON.stringify(transactionList);\r";
    print $command "console.log('clear');\r";
    unless( $command->expect($timeout, -re => '> clear' )){
        print ("JSON.stringify(transactionList);");
    }
    

    if($command->log_stdout){
        print "\n";
        print "======================log======================\n";
         $data = $command->before();
        my @arr =  split("> ",$data);
        print "======================split(>,data)======================\n";
        return @arr[1];
    }

}

# curl 접근하여 컨트랙트 메소드 호출 
# @parameter JSON Data
sub curlRequest {
    ($data) = @_;
    # my $command = Expect->spawn("curl --data '{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"eth_call\",\"params\":[{\"data\":\"0x06fdde03\",\"from\":\"0x3c9b507678e0c7c6390d696453e4739da2a5bc44\",\"to\":\"0xbc7ac585b862aa8c693b22d924c28b9cb6d36f0a\"},\"latest\"]}'  -H \"Content-Type: application/json\" -X POST 54.169.135.228:5006"); 
    my $command = Expect->spawn("curl --data '$data'  -H \"Content-Type: application/json\" -X POST http://108.136.46.103:5006"); 
    my $timeout = 10;
    unless( $command->expect($timeout, -re => ' ' )){
            print "====result====\n"
    }
    if($command->log_stdout){
            return $command->before();
    }
}

sub getTransactionList {
    print "getTransactionList\n";
    open( fileHandle,"/home/ubuntu/geth/log/transaction_node.txt" ) || die "Cannot open /home/ubuntu/geth/log/transaction_node.txt\n";
    my @allLines = <fileHandle>;   # 핸들을 통하여 모든 문자열을 배열로 읽어 들입니다. 파일이 너무 크면 좀 문제가 있겠죠.
    close( fileHandle ); # 다 읽었으니 꼭 닫습니다. !!!!!
    my $logCount = scalar @allLines;
    print $logCount."\n";
    my $jsonData;
    if($logCount > 11 ){
        for(my $ele = $logCount-1 ; $ele >= $logCount-10 ; $ele-- ){
            $allLines[$ele] =~ s/^\s+|\s+$//g;
            $jsonData =$jsonData.$allLines[$ele].",";
        }
        my $jsonDataLength = scalar $jsonData.length;
        my $sub = substr($jsonData,0,$jsonDataLength-1); 
        return "[".$sub."]";
    }
    else{
        return "[]";
    }
}

1;      