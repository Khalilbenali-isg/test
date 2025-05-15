"use client"
import { 
  Flex, 
  VStack, 
  Grid, 
  GridItem, 
  Box, 
  Heading, 
  Text,
  
 
} from "@chakra-ui/react"
import { Chart, useChart, BarSegment } from "@chakra-ui/charts"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { useColorModeValue } from '@/components/ui/color-mode';

export function AdminDashboard({ dashboardData }) {
  const {
    totalUsers,
    usersByRole,
    topSubscriptions,
    productPurchasesByMonth,
    totalProductRevenue,
    subscriptionRevenueByMonth
  } = dashboardData;

  const cardBg = useColorModeValue('white', 'gray.700')
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <VStack spacing={8} align="stretch">
      <Heading as="h1" size="xl">Dashboard</Heading>
      
     
      <Grid templateColumns="repeat(3, 1fr)" gap="6">
        <GridItem>
          <SummaryCard 
            title="Total Users" 
            value={totalUsers} 
            description="All registered users"
            bg={cardBg}
            hoverBg={cardHoverBg}
            borderColor={borderColor}
          />
        </GridItem>
        <GridItem>
          <SummaryCard 
            title="Total Product Revenue" 
            value={totalProductRevenue} 
            isCurrency 
            description="Revenue from product purchases"
            bg={cardBg}
            hoverBg={cardHoverBg}
            borderColor={borderColor}
          />
        </GridItem>
        <GridItem>
          <SummaryCard 
            title="Total Purchases" 
            value={productPurchasesByMonth.reduce((sum, month) => sum + month.count, 0)}
            description="Total product purchases"
            bg={cardBg}
            hoverBg={cardHoverBg}
            borderColor={borderColor}
          />
        </GridItem>
      </Grid>
      
      <Grid templateColumns="repeat(3, 1fr)"  gap={8}>
     
        <GridItem colSpan={3}>
          <ChartCard 
            title="Top Subscriptions"
            bg={cardBg}
            borderColor={borderColor}
          >
            <TopSubscriptionsChart topSubscriptions={topSubscriptions} />
          </ChartCard>
        </GridItem>
       
        <GridItem>
          <ChartCard 
            title="Users by Role"
            bg={cardBg}
            borderColor={borderColor}
          >
            <UsersByRoleChart usersByRole={usersByRole} />
          </ChartCard>
        </GridItem>
        
      
        
        
        <GridItem>
          <ChartCard 
            title="Monthly Product Purchases"
            bg={cardBg}
            borderColor={borderColor}
          >
            <MonthlyPurchasesChart productPurchasesByMonth={productPurchasesByMonth} />
          </ChartCard>
        </GridItem>
        
       
        <GridItem>
          <ChartCard 
            title="Subscription Revenue by Month"
            bg={cardBg}
            borderColor={borderColor}
          >
            <SubscriptionRevenueChart subscriptionRevenueByMonth={subscriptionRevenueByMonth} />
          </ChartCard>
        </GridItem>
      </Grid>
    </VStack>
  )
}

function SummaryCard({ title, value, isCurrency = false, description = "", bg, hoverBg, borderColor }) {
    const formattedValue = isCurrency 
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
      : value.toLocaleString()
  
    return (
      <Box
      marginY="8"
        p={6}
        bg={bg}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        transition="all 0.2s ease"
        _hover={{
          bg: hoverBg,
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
          cursor: 'pointer'
        }}
      >
        <Flex direction="column">
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            {title}
          </Text>
          <Heading as="h3" size="xl" mt={2} fontWeight="bold">
            {formattedValue}
          </Heading>
          {description && (
            <Text fontSize="sm" color="gray.500" mt={1}>
              {description}
            </Text>
          )}
        </Flex>
      </Box>
    )
  }

function ChartCard({ title, children, bg, borderColor ,hoverBg}) {
  return (
    <Box
      p={6}
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s ease"
       _hover={{
          bg: hoverBg,
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
          cursor: 'pointer'
        }}
    >
      <Heading as="h2" size="md" mb={4}>{title}</Heading>
      {children}
    </Box>
  )
}


function UsersByRoleChart({ usersByRole }) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const chart = useChart({
    data: usersByRole.map(role => ({
      name: role._id.charAt(0).toUpperCase() + role._id.slice(1),
      value: role.count
    }))
  });

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <PieChart>
        <Pie
          data={chart.data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chart.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Chart.Root>
  );
}


function TopSubscriptionsChart({ topSubscriptions }) {
  const chart = useChart({
    sort: { by: "count", direction: "desc" },
    data: topSubscriptions.map(sub => ({
      name: sub.name,
      value: sub.count,
      color: "teal.solid"
    })),
  });

  return (
    <BarSegment.Root chart={chart}>
      <BarSegment.Content>
        <BarSegment.Value />
        <BarSegment.Bar />
        <BarSegment.Label />
      </BarSegment.Content>
    </BarSegment.Root>
  );
}


function MonthlyPurchasesChart({ productPurchasesByMonth }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const chart = useChart({
    data: productPurchasesByMonth.map(item => ({
      month: monthNames[item._id - 1],
      purchases: item.count
    })),
    series: [{ name: "purchases", color: "blue.solid" }],
  });

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey={chart.key("month")} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        {chart.series.map((item) => (
          <Bar
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
          />
        ))}
      </BarChart>
    </Chart.Root>
  );
}


function SubscriptionRevenueChart({ subscriptionRevenueByMonth }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const monthlyData = {};
  
  subscriptionRevenueByMonth.forEach(item => {
    const monthKey = `${item._id.year}-${item._id.month}`;
    const monthName = monthNames[item._id.month - 1];
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthName,
        year: item._id.year,
        fullMonth: `${monthName} ${item._id.year}`
      };
    }
    
    monthlyData[monthKey][item._id.subscriptionName] = item.totalRevenue;
    monthlyData[monthKey].total = (monthlyData[monthKey].total || 0) + item.totalRevenue;
  });
  
  const chartData = Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
  });
  
  const subscriptionNames = [...new Set(
    subscriptionRevenueByMonth.map(item => item._id.subscriptionName)
  )];
  
  const colorMap = {
    "Pro Plan": "blue.solid",
    "basic Plan1": "green.solid",
    "test": "purple.solid"
  };
  
  const chart = useChart({
    data: chartData,
    series: subscriptionNames.map(name => ({ 
      name, 
      color: colorMap[name] || "teal.solid"
    })),
  });

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey="fullMonth" />
        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        {chart.series.map((item) => (
          <Bar
            key={item.name}
            dataKey={item.name}
            fill={chart.color(item.color)}
            stackId="revenue"
          />
        ))}
      </BarChart>
    </Chart.Root>
  );
}