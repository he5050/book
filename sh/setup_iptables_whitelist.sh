#!/bin/bash
# File: setup_iptables_whitelist.sh
# Description: 配置3306和22端口的IP白名单规则
# Usage: sudo ./setup_iptables_whitelist.sh

# 允许本地回环
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# 允许已建立的连接
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# ==================== 3306端口白名单 ====================
# 先设置默认DROP规则
sudo iptables -A INPUT -p tcp --dport 3306 -j DROP

# 允许指定的IP访问3306端口
WHITELIST_3306=(
    10.6.28.39
    10.25.132.35
    10.6.60.80 10.6.60.81 10.6.60.82 10.6.59.208
    10.25.129.228 10.25.128.127 10.25.128.25 10.25.128.64 10.25.128.143
    10.25.207.129 10.25.207.130 10.25.207.131 10.25.207.132
    10.25.207.133 10.25.207.134 10.25.207.135
    10.6.196.105 10.6.196.106
)

for ip in "${WHITELIST_3306[@]}"; do
    sudo iptables -I INPUT -p tcp -s "$ip" --dport 3306 -j ACCEPT
    echo "已允许IP $ip 访问3306端口"
done

# ==================== 22端口白名单 ====================
# 先设置默认DROP规则
sudo iptables -A INPUT -p tcp --dport 22 -j DROP

# 允许指定的IP访问22端口
WHITELIST_22=(
    10.6.28.39
    10.25.132.35
    10.6.60.80 10.6.60.81 10.6.60.82 10.6.59.208
)

for ip in "${WHITELIST_22[@]}"; do
    sudo iptables -I INPUT -p tcp -s "$ip" --dport 22 -j ACCEPT
    echo "已允许IP $ip 访问22端口"
done

# 保存规则（CentOS/RHEL）
if [ -f /etc/sysconfig/iptables ]; then
    sudo iptables-save > /etc/sysconfig/iptables
    echo "规则已保存到 /etc/sysconfig/iptables"
else
    sudo iptables-save > /etc/iptables.rules
    echo "规则已保存到 /etc/iptables.rules"
fi

# 显示当前规则
echo -e "\n当前iptables规则："
sudo iptables -L -n --line-numbers

echo -e "\n白名单配置完成！"