import express from "express";
import db from "../db.js";

const router = express.Router();



router.get("/Getcartitem", (req, res) => {

  const today = new Date();
  const date = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

  const sql = `
    SELECT bill.id, bill.Cid, bill.Billnum, bill.quantity, bill.Amount, 
    customer.name AS customerName, 
    user.name AS sellname,
    i.iname AS itename ,i.packsize AS packsize
    FROM bill
    LEFT JOIN customer ON bill.Cid = customer.Cid
    LEFT JOIN user ON bill.StId = user.id
    LEFT JOIN stock ON bill.Iid = stock.Sid
    LEFT JOIN item  i ON  stock.Iid = i.Iid
    WHERE bill.action = "successfull" AND bill.date = ?
  `;


  db.query(sql, [date], (err, result) => {

    if (err) return res.status(500).json({ error: "Database error" });


    const aggregated = {};
    const customerSet = new Set();   // unique customers

    result.forEach(item => {

      const billNo = item.Billnum;

      customerSet.add(item.Cid); // unique customer count

      if (!aggregated[billNo]) {

        aggregated[billNo] = {
          Billnum: billNo,
          customerName: item.customerName || "Unknown",
          seller : item.sellname,
          itemName : item.itename,
          totalBILLQuantity: 0,
          totalAmount: 0
          
        };

      }
     
      aggregated[billNo].totalBILLQuantity += item.quantity;
      aggregated[billNo].totalAmount += item.Amount;

    });

    const aggregated1 = {};
   

    result.forEach(row => {

      const itemName = row.itename || "Unknown" + "_" + row.packsize;


      if (!aggregated1[itemName]) {
        aggregated1[itemName] = {
          itemName: itemName,
          packsize: row.packsize,
          totalBILLQuantity: 0
        };
      }

      aggregated1[itemName].totalBILLQuantity += row.quantity;

    });

    const aggregatedArray = Object.values(aggregated);
    const aggregatedArray1 = Object.values(aggregated1);

    res.json({
      items: aggregatedArray,
      bills: aggregatedArray1, 
      customerCount: customerSet.size,
      
    });
    
  });

});

router.get("/GetBillDetails/:Billnum", (req, res) => {

  const { Billnum } = req.params;

  // console.log("Bill number:", Billnum);

  const sql = `
    SELECT bill.Billnum, bill.quantity, bill.Amount,
           customer.name AS customerName,
           item.iname, item.packsize,
           category.name AS catename
    FROM bill
    LEFT JOIN customer ON bill.Cid = customer.Cid
    LEFT JOIN stock ON bill.Iid = stock.Sid
    LEFT JOIN item ON stock.Iid = item.Iid
    LEFT JOIN category ON item.category = category.id
    WHERE bill.Billnum = ? AND bill.action = "successfull"
  `;

  db.query(sql, [Billnum], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.json(null);
    }

    const summary = {

      Billnum: result[0].Billnum,

      customerName: result[0].customerName || "Unknown",

      totalQuantity: result.reduce((sum, r) => sum + r.quantity, 0),

      totalAmount: result.reduce((sum, r) => sum + r.Amount, 0),

      items: result.map((r) => ({
        name: r.iname,
        packsize: r.packsize,
        category: r.catename,
        quantity: r.quantity,
        amount: r.Amount
      }))

    };

    res.json(summary);

  });

});

router.get("/Dailysales",(req ,res) => 
{

  const today = new Date();
  const date = today.getFullYear() + "-" +
  String(today.getMonth() + 1).padStart(2, "0") + "-" +
  String(today.getDate()).padStart(2, "0");

  const sql = `
    SELECT bill.id, bill.Cid, bill.Billnum, bill.quantity, bill.Amount,  
    i.iname AS itename ,i.packsize AS packsize,
    stock.price,stock.discount,stock.Sid AS Sid,
    c.name AS categoryName
    FROM bill
    LEFT JOIN stock ON bill.Iid = stock.Sid
    LEFT JOIN item  i ON  stock.Iid = i.Iid
    LEFT JOIN category c ON i.category = c.id
    WHERE bill.action = "successfull" AND bill.date = ?
  `;


  db.query(sql, [date], (err, result) => 
  {

    if (err)    
    {
      return res.status(500).json({ error: "Database error" });
    }

      const billSummary = {};
      const itemSummary = {};

      let totalAmount = 0;
      let totalProfit = 0;

      result.forEach(item => {

        const billNo = item.Billnum;
        const itemName = item.itename;

        const profit = (item.price * item.discount / 100) * item.quantity;

        // BILL-WISE
        if (!billSummary[billNo]) {
          billSummary[billNo] = {
            billNo: billNo,
            totalAmount: 0,
            totalProfit: 0
          };
        }

        billSummary[billNo].totalAmount += item.Amount;
        billSummary[billNo].totalProfit += profit;
        

        //ITEM-WISE
        if (!itemSummary[itemName]) {
          itemSummary[itemName] = {
            id: item.Sid,
            itemName: item.itename,
            packsize: item.packsize,
            category: item.categoryName,
            totalQuantity: 0,
            totalAmount: 0,
            totalProfit: 0
          };
        }
        
        itemSummary[itemName].totalQuantity += item.quantity;
        itemSummary[itemName].totalAmount += item.Amount;
        itemSummary[itemName].totalProfit += profit;

        // FULL TOTAL
        totalAmount += item.Amount;
        totalProfit += profit;

      });

      res.json({
        summary: {
          totalAmount,
          totalProfit
        },
        
        billWise: Object.values(billSummary),
        itemWise: Object.values(itemSummary)
      });

  });
});

router.get("/Searchdate/:date", (req,res) =>
{
  const { date } = req.params;
  
  const sql = `
    SELECT bill.id, bill.Cid, bill.Billnum, bill.quantity, bill.Amount,  
    i.iname AS itename ,i.packsize AS packsize,
    stock.price,stock.discount,
    c.name AS categoryName
    FROM bill
    LEFT JOIN stock ON bill.Iid = stock.Sid
    LEFT JOIN item  i ON  stock.Iid = i.Iid
    LEFT JOIN category c ON i.category = c.id
    WHERE bill.action = "successfull" AND bill.date = ?
  `;

  db.query(sql, [date], (err, result) => 
  {

    if (err)    
    {
      return res.status(500).json({ error: "Database error" });
    }

      const billSummary = {};
      const itemSummary = {};

      let totalAmount = 0;
      let totalProfit = 0;

      result.forEach(item => {

        const billNo = item.Billnum;
        const itemName = item.itename;

        const profit = (item.price * item.discount / 100) * item.quantity;

        // BILL-WISE
        if (!billSummary[billNo]) {
          billSummary[billNo] = {
            billNo: billNo,
            totalAmount: 0,
            totalProfit: 0
          };
        }

        billSummary[billNo].totalAmount += item.Amount;
        billSummary[billNo].totalProfit += profit;
        

        //ITEM-WISE
        if (!itemSummary[itemName]) {
          itemSummary[itemName] = {
            itemName: item.itename,
            packsize: item.packsize,
            category: item.categoryName,
            totalQuantity: 0,
            totalAmount: 0,
            totalProfit: 0
          };
        }
        
        itemSummary[itemName].totalQuantity += item.quantity;
        itemSummary[itemName].totalAmount += item.Amount;
        itemSummary[itemName].totalProfit += profit;

        // FULL TOTAL
        totalAmount += item.Amount;
        totalProfit += profit;

      });

      res.json({
        summary: {
          totalAmount,
          totalProfit
        },
        
        billWise: Object.values(billSummary),
        itemWise: Object.values(itemSummary)
      });

  });

});

router.get("/AvailableItem/:id", (req, res) => {
  const { id } = req.params;
  

  const today = new Date();
  const date = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

  const sql = `
    SELECT 
      stock.quantity AS stockQty,
      bill.quantity AS soldQty
    FROM stock
    LEFT JOIN bill 
      ON bill.Iid = stock.Sid 
      AND bill.action = "successfull"
      AND bill.date = ?
    WHERE stock.Sid = ?
  `;

  db.query(sql, [date, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result[0]);
  });
});

router.get("/MonthlySale", (req, res) => {

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  const sql = `
    SELECT 
      bill.Billnum,
      bill.quantity,
      bill.Amount,
      s.price,
      s.discount
    FROM bill 
    LEFT JOIN stock s ON bill.Iid = s.Sid
    WHERE bill.action = "successfull"
      AND YEAR(bill.date) = ?
      AND MONTH(bill.date) = ?
  `;

  db.query(sql, [year, month], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database Error" });
    }

    let totalQuantity = 0;
    let totalAmount = 0;
    let totalProfit = 0;

    result.forEach(item => {

      const profit = (item.price * item.discount / 100) * item.quantity;

      totalQuantity += item.quantity;
      totalAmount += item.Amount;
      totalProfit += profit;

    });

    res.json({
      totalQuantity,
      totalAmount,
      totalProfit
    });

  });

});

router.get("/MonthlyAnalytics", (req, res) => {

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const sql = `
    SELECT 
      DAY(bill.date) AS day,
      SUM(bill.quantity) AS totalQuantity,
      SUM(bill.Amount) AS totalAmount,
      SUM((bill.Amount * s.discount) / 100) AS totalProfit
    FROM bill
    LEFT JOIN stock s ON bill.Iid = s.Sid
    WHERE bill.action = "successfull"
      AND YEAR(bill.date) = ?
      AND MONTH(bill.date) = ?
    GROUP BY DAY(bill.date)
    ORDER BY day ASC
  `;

  db.query(sql, [year, month], (err, result) => {
    if (err) return res.status(500).json(err);


    res.json({
      days: result
      
    });
  });
});

router.get("/SearchMonth/:month", (req, res) => {

  const { month } = req.params;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [year, mon] = month.split("-");
  const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthName = monthNames[parseInt(mon) - 1];

  if (year > currentYear || (year == currentYear && mon > currentMonth)) {
  return res.status(400).json({
    error: "Future month not allowed"
  });
  }

  else
  {

    const sql = `
      SELECT bill.id, bill.Cid, bill.Billnum, bill.quantity, bill.Amount,  
      i.iname AS itename ,i.packsize AS packsize,
      stock.price,stock.discount,
      c.name AS categoryName
      FROM bill
      LEFT JOIN stock ON bill.Iid = stock.Sid
      LEFT JOIN item  i ON  stock.Iid = i.Iid
      LEFT JOIN category c ON i.category = c.id
      WHERE bill.action = "successfull" 
      AND YEAR(bill.date) = ?  AND MONTH(bill.date) = ?
    `;

    db.query(sql, [year, mon], (err, result) => {

      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      const itemSummary = {};
      let totalAmount = 0;
      let totalProfit = 0;
      let totalQuantity = 0;

      result.forEach(item => {

        const itemName = item.itename;
        const profit = (item.price * item.discount / 100) * item.quantity;

        if (!itemSummary[itemName]) {
          itemSummary[itemName] = {
            itemName: item.itename,
            packsize: item.packsize,
            category: item.categoryName,
            totalQuantity: 0,
            totalAmount: 0,
            totalProfit: 0
          };
        }
          itemSummary[itemName].totalQuantity += item.quantity;
          itemSummary[itemName].totalAmount += item.Amount;
          itemSummary[itemName].totalProfit += profit;

        totalQuantity += item.quantity
        totalAmount += item.Amount;
        totalProfit += profit;


      });

      res.json({
        itemWise: Object.values(itemSummary),
        totalAmount,
        totalProfit,
        totalQuantity,
        year,
        monthName
      });

    });
  }
});

router.get("/DateSales/:saledate", (req, res) => {
  const { saledate } = req.params;

  const today = new Date();
  const date = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(saledate).padStart(2, "0");

  console.log("date is"+date);
 
const sql = `SELECT bill.id, bill.Cid, bill.Billnum, bill.quantity, bill.Amount,  
    i.iname AS itename ,i.packsize AS packsize
    FROM bill
    LEFT JOIN stock ON bill.Iid = stock.Sid
    LEFT JOIN item  i ON  stock.Iid = i.Iid
    WHERE bill.action = "successfull" AND bill.date = ?
  `;


  db.query(sql, [date], (err, result) => {

    if (err) return res.status(500).json({ error: "Database error" });

    const aggregated = {};
   

    result.forEach(row => {

      const itemName = row.itename || "Unknown" + "_" + row.packsize;


      if (!aggregated[itemName]) {
        aggregated[itemName] = {
          itemName: itemName,
          packsize: row.packsize,
          totalBILLQuantity: 0
        };
      }

      aggregated[itemName].totalBILLQuantity += row.quantity;

    });

    const aggregatedArray = Object.values(aggregated);


    res.json({
      items: aggregatedArray
      
    });
    
  });

});

router.get("/YearlySale", (req, res) => {

  const year = new Date().getFullYear();


  const sql = `
    SELECT 
      bill.id, 
      bill.Cid, 
      bill.Billnum, 
      bill.quantity, 
      bill.Amount,  
      i.iname AS itename,
      i.packsize AS packsize,
      i.Iid AS itemId,
      stock.price,
      stock.discount,
      c.name AS categoryName
    FROM bill
    LEFT JOIN stock ON bill.Iid = stock.Sid
    LEFT JOIN item i ON stock.Iid = i.Iid
    LEFT JOIN category c ON i.category = c.id
    WHERE bill.action = "successfull" 
    AND YEAR(bill.date) = ?
  `;


  const topItemSql = `
    SELECT 
      i.iname AS name,
      i.packsize,
      SUM(bill.quantity) AS qty
    FROM bill
    LEFT JOIN stock s ON bill.Iid = s.Sid
    LEFT JOIN item i ON s.Iid = i.Iid
    WHERE bill.action = "successfull"
      AND YEAR(bill.date) = ?
    GROUP BY i.Iid  
    ORDER BY qty DESC 
    LIMIT 1
  `;

 
  const yearlyQuery = `
    SELECT 
      YEAR(bill.date) AS year,
      SUM(bill.Amount) AS totalAmount,
      SUM((bill.Amount * s.discount) / 100) AS totalProfit
    FROM bill
    LEFT JOIN stock s ON bill.Iid = s.Sid
    LEFT JOIN item i ON s.Iid = i.Iid
    WHERE bill.action = "successfull"
    GROUP BY YEAR(bill.date)
    ORDER BY YEAR(bill.date) ASC
    LIMIT 6
  `;


  db.query(sql, [year], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database Error" });
    }

    const itemSummary = {};
    let totalQuantity = 0;
    let totalAmount = 0;
    let totalProfit = 0;

    result.forEach(item => {

      const itemName = item.itename;
      const quantity = item.quantity || 0;
      const amount = item.Amount || 0;
      const price = item.price || 0;
      const discount = item.discount || 0;

      const profit = ((price * discount) / 100) * quantity;

      if (!itemSummary[itemName]) {
        itemSummary[itemName] = {
          itemName: item.itename,
          itemId: item.itemId,
          packsize: item.packsize,
          category: item.categoryName,
          totalQuantity: 0,
          totalAmount: 0,
          totalProfit: 0
        };
      }

      itemSummary[itemName].totalQuantity += quantity;
      itemSummary[itemName].totalAmount += amount;
      itemSummary[itemName].totalProfit += profit;

      totalQuantity += quantity;
      totalAmount += amount;
      totalProfit += profit;
    });


    db.query(topItemSql, [year], (err2, topResult) => {
      if (err2) {
        console.log(err2);
        return res.status(500).json(err2);
      }


      db.query(yearlyQuery, (err3, yearlyResults) => {
        if (err3) {
          console.log(err3);
          return res.status(500).json(err3);
        }


        res.json({
          itemWise: Object.values(itemSummary),
          year: year,
          totalQuantity,
          totalAmount,
          totalProfit,
          topItem: topResult[0] || null,
          yearSale: yearlyResults
        });
      });

    });

  });

});

router.get("/SearchYear/:years", (req, res) => {

  const { years } = req.params;
  const today = new Date();
  const currentYear = today.getFullYear();



  if (years > currentYear) {
  return res.status(400).json({
    error: "Future Year not allowed."
  });
  }

  else
  {

    const sql = `
      SELECT bill.id, bill.Cid, bill.Billnum, bill.quantity, bill.Amount,  
      i.iname AS itename ,i.packsize AS packsize,
      stock.price,stock.discount,
      c.name AS categoryName
      FROM bill
      LEFT JOIN stock ON bill.Iid = stock.Sid
      LEFT JOIN item  i ON  stock.Iid = i.Iid
      LEFT JOIN category c ON i.category = c.id
      WHERE bill.action = "successfull" 
      AND YEAR(bill.date) = ? 
    `;

    db.query(sql, [years], (err, result) => {

      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      const itemSummary = {};
      let totalAmount = 0;
      let totalProfit = 0;
      let totalQuantity = 0;

      result.forEach(item => {

        const itemName = item.itename;
        const profit = (item.price * item.discount / 100) * item.quantity;

        if (!itemSummary[itemName]) {
          itemSummary[itemName] = {
            itemName: item.itename,
            packsize: item.packsize,
            category: item.categoryName,
            totalQuantity: 0,
            totalAmount: 0,
            totalProfit: 0
          };
        }
          itemSummary[itemName].totalQuantity += item.quantity;
          itemSummary[itemName].totalAmount += item.Amount;
          itemSummary[itemName].totalProfit += profit;

        totalQuantity += item.quantity
        totalAmount += item.Amount;
        totalProfit += profit;


      });

      res.json({
        itemWise: Object.values(itemSummary),
        totalAmount,
        totalProfit,
        totalQuantity,
        years

      });

    });
  }
});

router.get("/YearlySold/:id", (req, res) => {
  const { id } = req.params;
  const today = new Date();
  const year = today.getFullYear();
  

  const sql = `
    SELECT 
      MONTH(bill.date) AS month,
      DATE_FORMAT(bill.date, '%b') AS monthName,
      SUM(bill.quantity) AS totalQuantity,
      SUM(bill.Amount) AS totalAmount,
      SUM((bill.Amount * s.discount) / 100) AS totalProfit,
      i.iname AS itemName, i.packsize
    FROM bill
    LEFT JOIN stock s ON bill.Iid = s.Sid
    LEFT JOIN item i ON s.Iid = i.Iid
    WHERE bill.action = "successfull"
      AND YEAR(bill.date) = ?
      AND i.Iid = ?
    GROUP BY MONTH(bill.date), DATE_FORMAT(bill.date, '%b')
    ORDER BY MONTH(bill.date) ASC
  `;


  db.query(sql, [year, id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      yearSale: result
    });
  });
});

export default router;
