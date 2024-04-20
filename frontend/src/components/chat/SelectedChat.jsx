import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SelectedChat = () => {
  return (
    <div className="bg-red-200 w-4/6">
      {/* Chats will be visible here */}
      <div>
        {/* Heading */}
        <div className="w-full h-16 bg-blue-500 flex justify-between items-center p-3">
          <div className="bg-green-300 flex gap-5 items-center">
            <div
              className="relative overflow-hidden bg-gray-200 rounded-full"
              style={{ height: "40px", width: "40px" }}
            >
              <img
                className="w-full h-full object-cover absolute top-0 left-0"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4bPpNmnBUF-JKHYe7g2joB4kJOwuKnp98A&usqp=CAU"
                alt="Your Image"
              />
            </div>
            <h4 className="font-semibold">Users Name</h4>
          </div>
          <div className=""></div>
        </div>
        {/* Chats */}
        <ScrollArea
          className="h-full p-4 bg-purple-500"
          style={{ height: "calc(100vh - 128px)" }}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum
          ratione accusamus neque esse accusantium nemo magnam, doloribus ullam
          et officia est placeat error in consectetur quasi dolorum eos eaque
          voluptatibus non voluptates nostrum eius, quas eligendi. Facilis ipsa
          eos maxime. Voluptas, cum soluta numquam nobis sapiente quibusdam
          reprehenderit ea asperiores repellat expedita hic at sed! Expedita,
          nobis. Autem cum sunt numquam quos quasi dolore aliquid harum incidunt
          eos laboriosam, consectetur libero exercitationem corrupti quam
          consequatur! Consectetur perferendis quos vel tempore mollitia, magnam
          eligendi? Itaque veritatis debitis nisi asperiores nihil labore
          placeat maxime. Cum nesciunt odit quasi animi vitae impedit eum dicta!
          Consequuntur officiis, eveniet modi odio fuga quas inventore debitis
          at! Aut excepturi, dolor voluptates voluptatibus, perferendis enim
          ipsum sed maiores sequi consequuntur consequatur quaerat iste tenetur
          ipsa minima dolore ratione incidunt? Nulla dolor veniam hic
          consequatur dicta molestiae soluta, provident voluptatem eveniet
          eligendi, minima rerum ea similique voluptates ad? Esse architecto
          dolorem enim ex nisi qui inventore reprehenderit porro nulla quia
          autem deleniti nobis rerum, laboriosam nostrum suscipit incidunt
          aliquam quod illo beatae sit labore recusandae nemo dolor? Maiores
          impedit quibusdam, consequatur voluptas eaque eum similique accusamus.
          Provident velit mollitia minus ut sed numquam, enim facere rem
          delectus eligendi fugiat, rerum asperiores. Molestiae minima inventore
          ea, provident magni eaque nulla dolorum perferendis! A et placeat
          laboriosam sint porro ducimus quo ex inventore repellat voluptates
          optio, ullam repellendus nihil doloribus totam ea explicabo laborum
          quis? Similique consequuntur quas quis maiores deleniti ab labore
          ratione accusamus neque esse accusantium nemo magnam, doloribus ullam
          et officia est placeat error in consectetur quasi dolorum eos eaque
          voluptatibus non voluptates nostrum eius, quas eligendi. Facilis ipsa
          eos maxime. Voluptas, cum soluta numquam nobis sapiente quibusdam
          reprehenderit ea asperiores repellat expedita hic at sed! Expedita,
          nobis. Autem cum sunt numquam quos quasi dolore aliquid harum incidunt
          eos laboriosam, consectetur libero exercitationem corrupti quam
          consequatur! Consectetur perferendis quos vel tempore mollitia, magnam
          eligendi? Itaque veritatis debitis nisi asperiores nihil labore
          placeat maxime. Cum nesciunt odit quasi animi vitae impedit eum dicta!
          Consequuntur officiis, eveniet modi odio fuga quas inventore debitis
          at! Aut excepturi, dolor voluptates voluptatibus, perferendis enim
          ipsum sed maiores sequi consequuntur consequatur quaerat iste tenetur
          ipsa minima dolore ratione incidunt? Nulla dolor veniam hic
          consequatur dicta molestiae soluta, provident voluptatem eveniet
          eligendi, minima rerum ea similique voluptates ad? Esse architecto
          dolorem enim ex nisi qui inventore reprehenderit porro nulla quia
          autem deleniti nobis rerum, laboriosam nostrum suscipit incidunt
          aliquam quod illo beatae sit labore recusandae nemo dolor? Maiores
          impedit quibusdam, consequatur voluptas eaque eum similique accusamus.
          Provident velit mollitia minus ut sed numquam, enim facere rem
          delectus eligendi fugiat, rerum asperiores. Molestiae minima inventore
          ea, provident magni eaque nulla dolorum perferendis! A et placeat
          laboriosam sint porro ducimus quo ex inventore repellat voluptates
          optio, ullam repellendus nihil doloribus totam ea explicabo laborum
          quis? Similique consequuntur quas quis maiores deleniti ab labore
          ratione accusamus neque esse accusantium nemo magnam, doloribus ullam
          et officia est placeat error in consectetur quasi dolorum eos eaque
          voluptatibus non voluptates nostrum eius, quas eligendi. Facilis ipsa
          eos maxime. Voluptas, cum soluta numquam nobis sapiente quibusdam
          reprehenderit ea asperiores repellat expedita hic at sed! Expedita,
          nobis. Autem cum sunt numquam quos quasi dolore aliquid harum incidunt
          eos laboriosam, consectetur libero exercitationem corrupti quam
          consequatur! Consectetur perferendis quos vel tempore mollitia, magnam
          eligendi? Itaque veritatis debitis nisi asperiores nihil labore
          placeat maxime. Cum nesciunt odit quasi animi vitae impedit eum dicta!
          Consequuntur officiis, eveniet modi odio fuga quas inventore debitis
          at! Aut excepturi, dolor voluptates voluptatibus, perferendis enim
          ipsum sed maiores sequi consequuntur consequatur quaerat iste tenetur
          ipsa minima dolore ratione incidunt? Nulla dolor veniam hic
          consequatur dicta molestiae soluta, provident voluptatem eveniet
          eligendi, minima rerum ea similique voluptates ad? Esse architecto
          dolorem enim ex nisi qui inventore reprehenderit porro nulla quia
          autem deleniti nobis rerum, laboriosam nostrum suscipit incidunt
          aliquam quod illo beatae sit labore recusandae nemo dolor? Maiores
          impedit quibusdam, consequatur voluptas eaque eum similique accusamus.
          Provident velit mollitia minus ut sed numquam, enim facere rem
          delectus eligendi fugiat, rerum asperiores. Molestiae minima inventore
          ea, provident magni eaque nulla dolorum perferendis! A et placeat
          laboriosam sint porro ducimus quo ex inventore repellat voluptates
          optio, ullam repellendus nihil doloribus totam ea explicabo laborum
          quis? Similique consequuntur quas quis maiores deleniti ab labore
          ratione accusamus neque esse accusantium nemo magnam, doloribus ullam
          et officia est placeat error in consectetur quasi dolorum eos eaque
          voluptatibus non voluptates nostrum eius, quas eligendi. Facilis ipsa
          eos maxime. Voluptas, cum soluta numquam nobis sapiente quibusdam
          reprehenderit ea asperiores repellat expedita hic at sed! Expedita,
          nobis. Autem cum sunt numquam quos quasi dolore aliquid harum incidunt
          eos laboriosam, consectetur libero exercitationem corrupti quam
          consequatur! Consectetur perferendis quos vel tempore mollitia, magnam
          eligendi? Itaque veritatis debitis nisi asperiores nihil labore
          placeat maxime. Cum nesciunt odit quasi animi vitae impedit eum dicta!
          Consequuntur officiis, eveniet modi odio fuga quas inventore debitis
          at! Aut excepturi, dolor voluptates voluptatibus, perferendis enim
          ipsum sed maiores sequi consequuntur consequatur quaerat iste tenetur
          ipsa minima dolore ratione incidunt? Nulla dolor veniam hic
          consequatur dicta molestiae soluta, provident voluptatem eveniet
          eligendi, minima rerum ea similique voluptates ad? Esse architecto
          dolorem enim ex nisi qui inventore reprehenderit porro nulla quia
          autem deleniti nobis rerum, laboriosam nostrum suscipit incidunt
          aliquam quod illo beatae sit labore recusandae nemo dolor? Maiores
          impedit quibusdam, consequatur voluptas eaque eum similique accusamus.
          Provident velit mollitia minus ut sed numquam, enim facere rem
          delectus eligendi fugiat, rerum asperiores. Molestiae minima inventore
          ea, provident magni eaque nulla dolorum perferendis! A et placeat
          laboriosam sint porro ducimus quo ex inventore repellat voluptates
          optio, ullam repellendus nihil doloribus totam ea explicabo laborum
          quis? Similique consequuntur quas quis maiores deleniti ab labore
          explicabo qui ipsa, voluptates, adipisci, officia in repellendus sint
          voluptatibus sequi eum alias voluptatem facilis non quasi dolorem
          perferendis nisi? Dolores sint sunt quo architecto adipisci,
          voluptatum aliquid enim? Veritatis fugit reiciendis reprehenderit
          voluptatum doloremque accusantium, quod voluptatibus aliquid illum,
          doloribus adipisci ullam quis asperiores dolores illo aspernatur,
          harum quibusdam? Hic autem alias amet, tempore qui nemo.
        </ScrollArea>
        <div className="h-16 bg-orange-400 flex px-3 gap-3 items-center">
          <div>Emoji</div>
          <form
            //   onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full gap-3"
          >
            <input
              type="text"
              className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm outline-none"
              placeholder="Type a message"
            />
            <button type="submit" className="bg-red-500">
              send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
